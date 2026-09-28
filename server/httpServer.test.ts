import { afterEach, describe, expect, it } from 'vitest'
import type { AddressInfo } from 'node:net'
import { createAuthorityServer } from './httpServer.js'

const servers: ReturnType<typeof createAuthorityServer>[] = []
afterEach(async () => Promise.all(servers.splice(0).map((server) => new Promise<void>((resolve) => server.close(() => resolve())))))

async function start() {
  const server = createAuthorityServer()
  servers.push(server)
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  return `http://127.0.0.1:${(server.address() as AddressInfo).port}`
}

describe('qualification service API', () => {
  it.each(['/healthz', '/readyz'])('serves %s', async (path) => {
    const base = await start()
    expect((await fetch(`${base}${path}`)).status).toBe(200)
  })

  it('reports disabled execution and prerequisite blockers', async () => {
    const base = await start()
    const status = await (await fetch(`${base}/api/v1/status`)).json()
    expect(status).toMatchObject({ sourceState: 'rehearsal', executionAuthorityEnabled: false, scope: 'synthetic-lab-only' })
  })

  it('accepts correlation and idempotency headers', async () => {
    const base = await start()
    const response = await fetch(`${base}/api/v1/loop/run`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-correlation-id': 'corr-http', 'idempotency-key': 'idem-http' },
      body: JSON.stringify({ scenario: 'restart_required', requestedStage: 'recommend', namespace: 'agentic-ai-601-lab-http' }),
    })
    expect(await response.json()).toMatchObject({ correlationId: 'corr-http', idempotencyKey: 'idem-http', decision: { disposition: 'recommend' } })
  })

  it('rejects invalid scenarios', async () => {
    const base = await start()
    const response = await fetch(`${base}/api/v1/loop/run`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ scenario: 'production-delete', requestedStage: 'bounded_action', namespace: 'production', correlationId: 'c', idempotencyKey: 'i' }) })
    expect(response.status).toBe(400)
  })

  it('requires a named human actor for the emergency stop', async () => {
    const base = await start()
    const rejected = await fetch(`${base}/api/v1/control/emergency-stop`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ active: true }) })
    expect(rejected.status).toBe(400)
    const accepted = await fetch(`${base}/api/v1/control/emergency-stop`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-human-actor': 'reviewer@example.test' }, body: JSON.stringify({ active: true }) })
    expect(await accepted.json()).toMatchObject({ active: true, actor: 'reviewer@example.test', authority: 'human_override' })
  })
})
