import { createJsonAdapter, registerAdapter } from './adapters'

const collectedAt = '2026-09-28T00:00:00.000Z'
const endpoint = '/api/v1/loop/run'
const base = { namespace: 'agentic-ai-601-lab-demo', simulation: false }

registerAdapter(createJsonAdapter({
  id: 'loop-observe', url: endpoint, method: 'POST', body: { ...base, scenario: 'restart_required', requestedStage: 'observe', correlationId: 'rehearsal-observe', idempotencyKey: 'rehearsal-observe' },
  rehearsal: { collectedAt, data: { condition: 'synthetic.pod_unhealthy', source: 'REHEARSAL fixture', authority: 'observe only' } },
}))

registerAdapter(createJsonAdapter({
  id: 'loop-recommend', url: endpoint, method: 'POST', body: { ...base, scenario: 'restart_required', requestedStage: 'recommend', correlationId: 'rehearsal-recommend', idempotencyKey: 'rehearsal-recommend' },
  rehearsal: { collectedAt, data: { disposition: 'recommend', risk: 'low', reason: 'recommendation only' } },
}))

registerAdapter(createJsonAdapter({
  id: 'loop-action', url: endpoint, method: 'POST', body: { ...base, simulation: true, scenario: 'restart_required', requestedStage: 'bounded_action', correlationId: 'rehearsal-action', idempotencyKey: 'rehearsal-action', approvalToken: 'rehearsal-single-use-approval' },
  rehearsal: { collectedAt, data: { executed: 'synthetic simulation only', targets: 'one', production_authority: 'disabled' } },
}))

registerAdapter(createJsonAdapter({
  id: 'loop-rollback', url: endpoint, method: 'POST', body: { ...base, simulation: true, scenario: 'validation_failure', requestedStage: 'validate_or_rollback', correlationId: 'rehearsal-rollback', idempotencyKey: 'rehearsal-rollback', approvalToken: 'rehearsal-rollback-approval' },
  rehearsal: { collectedAt, data: { validation: 'failed', rollback: 'passed', demotion: 'automatic', production_authority: 'disabled' } },
}))
