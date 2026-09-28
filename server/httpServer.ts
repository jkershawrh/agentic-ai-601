import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { EarnedAuthorityEngine } from './engine.js'
import type { AuthorityStage, LoopRequest, Scenario } from './types.js'

const scenarios = new Set<Scenario>(['healthy', 'restart_required', 'policy_denied', 'validation_failure', 'kill_switch'])
const stages = new Set<AuthorityStage>(['observe', 'recommend', 'human_approval', 'bounded_action', 'validate_or_rollback', 'learn'])

function json(response: ServerResponse, status: number, body: unknown) {
  response.writeHead(status, { 'content-type': 'application/json', 'cache-control': 'no-store' })
  response.end(JSON.stringify(body))
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
