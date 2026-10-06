import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { EarnedAuthorityEngine } from './engine.js'
import type { AuthorityStage, LoopRequest, Scenario } from './types.js'

const scenarios = new Set<Scenario>(['healthy', 'restart_required', 'policy_denied', 'validation_failure', 'kill_switch'])
const stages = new Set<AuthorityStage>(['observe', 'recommend', 'shadow', 'human_approval', 'bounded_action', 'validate_or_rollback', 'learn'])

function json(response: ServerResponse, status: number, body: unknown) {
  response.writeHead(status, { 'content-type': 'application/json', 'cache-control': 'no-store' })
  response.end(JSON.stringify(body))
}

function qualificationView(response: ServerResponse, engine: EarnedAuthorityEngine) {
  const status = engine.status()
  const prerequisiteCount = Object.values(status.prerequisites).filter(Boolean).length
  const page = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Qualification Evidence · Agentic AI 601</title>
<style>
@font-face{font-family:RedHatText;src:local("Red Hat Text")}*{box-sizing:border-box}body{margin:0;background:#151515;color:#f5f5f5;font-family:RedHatText,Arial,sans-serif}.shell{max-width:1080px;margin:auto;padding:32px}.brand{display:flex;align-items:center;gap:12px;color:#b8bbbe;font-size:14px}.brand b{color:#fff}.hero{margin-top:28px;padding:30px;border:1px solid #3c3f42;border-top:4px solid #ee0000;background:#202020}.eyebrow{color:#00b6ed;font-size:12px;font-weight:700;letter-spacing:.13em}.badge{display:inline-block;margin-top:14px;border:1px solid #f0ab00;border-radius:999px;padding:5px 10px;color:#f0ab00;font-size:12px;font-weight:700}.hero h1{font-size:38px;margin:14px 0 8px}.hero p{color:#c7c7c7;max-width:760px;line-height:1.55}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin-top:18px}.card{padding:20px;border:1px solid #3c3f42;background:#252525}.label{color:#8a8d90;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}.value{font-size:20px;font-weight:700;margin-top:9px}.safe{color:#92d400}.warn{color:#f0ab00}.boundary{margin-top:18px;padding:18px;border-left:4px solid #ee0000;background:#2b1b1b}.boundary strong{display:block;margin-bottom:6px}.foot{margin-top:20px;color:#8a8d90;font-size:12px}
</style></head><body><main class="shell"><div class="brand"><b>Red Hat</b><span>×</span><b>Intel</b><span>AI Launchpad</span></div><section class="hero"><div class="eyebrow">AGENTIC AI 601 · EARNED AUTHORITY</div><span class="badge">REHEARSAL</span><h1>Qualification Evidence</h1><p>This operator summarizes the bounded authority exercise. It is evidence for human review—not permission to act in production.</p><div class="grid"><article class="card"><div class="label">Source state</div><div class="value warn">${status.sourceState}</div></article><article class="card"><div class="label">Execution authority</div><div class="value safe">Disabled</div></article><article class="card"><div class="label">Prerequisites certified</div><div class="value">${prerequisiteCount} / 2</div></article><article class="card"><div class="label">Evidence records</div><div class="value">${status.evidenceRecords}</div></article></div><div class="boundary"><strong>Human review required</strong>No production authority is granted. The target remains unmodified, promotion is disabled, and all evidence is synthetic rehearsal data.</div><div class="foot">Scope: ${status.scope} · Emergency stop: ${status.emergencyStopActive ? 'active' : 'ready'}</div></section></main></body></html>`
  response.writeHead(200, {
    'content-type': 'text/html; charset=utf-8',
    'cache-control': 'no-store',
    'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; frame-ancestors https://*.smg-helix.ai https://*.fm2aihpcsed.com",
    'x-content-type-options': 'nosniff',
  })
  response.end(page)
}

async function body(request: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = []
  for await (const chunk of request) chunks.push(Buffer.from(chunk))
  if (chunks.reduce((sum, chunk) => sum + chunk.length, 0) > 32_768) throw new Error('request_too_large')
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as Record<string, unknown>
}

function parseLoop(value: Record<string, unknown>, request: IncomingMessage): LoopRequest {
  const scenario = value.scenario
  const requestedStage = value.requestedStage
  const namespace = value.namespace
  const correlationId = request.headers['x-correlation-id'] ?? value.correlationId
  const idempotencyKey = request.headers['idempotency-key'] ?? value.idempotencyKey
  if (typeof scenario !== 'string' || !scenarios.has(scenario as Scenario)) throw new Error('invalid_scenario')
  if (typeof requestedStage !== 'string' || !stages.has(requestedStage as AuthorityStage)) throw new Error('invalid_stage')
  if (typeof namespace !== 'string' || typeof correlationId !== 'string' || typeof idempotencyKey !== 'string') throw new Error('missing_identity')
  return { scenario: scenario as Scenario, requestedStage: requestedStage as AuthorityStage, namespace, correlationId, idempotencyKey, approvalToken: typeof value.approvalToken === 'string' ? value.approvalToken : undefined, simulation: value.simulation === true }
}

export function createAuthorityServer(engine = new EarnedAuthorityEngine()) {
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? '/', 'http://localhost')
      if (request.method === 'GET' && (url.pathname === '/healthz' || url.pathname === '/readyz')) return json(response, 200, { status: 'ok' })
      if (request.method === 'GET' && url.pathname === '/api/v1/status') return json(response, 200, engine.status())
      if (request.method === 'GET' && url.pathname === '/api/v1/status/view') return qualificationView(response, engine)
      if (request.method === 'GET' && url.pathname === '/api/v1/evidence/verify') return json(response, 200, { valid: engine.verifyChain() })
      if (request.method === 'POST' && url.pathname === '/api/v1/control/emergency-stop') {
        const value = await body(request)
        const actor = request.headers['x-human-actor']
        if (typeof value.active !== 'boolean' || typeof actor !== 'string') throw new Error('human_actor_and_boolean_active_required')
        return json(response, 200, engine.setEmergencyStop(value.active, actor))
      }
      if (request.method === 'POST' && url.pathname === '/api/v1/loop/run') return json(response, 200, engine.run(parseLoop(await body(request), request)))
      return json(response, 404, { error: 'not_found' })
    } catch (error) {
      return json(response, 400, { error: error instanceof Error ? error.message : 'invalid_request' })
    }
  })
  return server
}
