import { describe, expect, it } from 'vitest'
import { EarnedAuthorityEngine } from './engine.js'
import type { AuthorityStage, LoopRequest, Scenario } from './types.js'

const request = (scenario: Scenario, requestedStage: AuthorityStage, overrides: Partial<LoopRequest> = {}): LoopRequest => ({
  scenario,
  requestedStage,
  namespace: 'agentic-ai-601-lab-test',
  correlationId: `corr-${scenario}-${requestedStage}`,
  idempotencyKey: `idem-${scenario}-${requestedStage}`,
  ...overrides,
})

describe('earned-authority ladder', () => {
  it.each([
    ['observe', 'observe'],
    ['recommend', 'recommend'],
    ['human_approval', 'request_approval'],
    ['bounded_action', 'request_approval'],
  ] as const)('%s remains bounded without approval', (stage, disposition) => {
    expect(new EarnedAuthorityEngine().run(request('restart_required', stage)).decision.disposition).toBe(disposition)
  })

  it('never performs real execution while prerequisites remain incomplete', () => {
    const result = new EarnedAuthorityEngine().run(request('restart_required', 'bounded_action', { approvalToken: 'approval-1' }))
    expect(result.decision.reason).toBe('prerequisite_certification_incomplete')
    expect(result.action.executed).toBe(false)
    expect(result.authority.executionAuthorityEnabled).toBe(false)
  })

  it('permits an explicitly synthetic, reversible simulation', () => {
    const result = new EarnedAuthorityEngine().run(request('restart_required', 'bounded_action', { approvalToken: 'approval-1', simulation: true }))
    expect(result.action).toMatchObject({ executed: true, simulated: true, attempts: 1, targetCount: 1 })
    expect(result.validation.passed).toBe(true)
    expect(result.learning.promotionEligible).toBe(false)
  })
})

describe('failure and authority boundaries', () => {
  it('denies out-of-scope namespaces', () => {
    expect(new EarnedAuthorityEngine().run(request('restart_required', 'bounded_action', { namespace: 'production', simulation: true, approvalToken: 'a' })).decision.reason).toBe('namespace_out_of_scope')
  })

  it('denies non-allowlisted conditions', () => {
    expect(new EarnedAuthorityEngine().run(request('policy_denied', 'bounded_action', { simulation: true, approvalToken: 'a' })).action.executed).toBe(false)
  })

  it('honors the emergency stop before action', () => {
    const result = new EarnedAuthorityEngine().run(request('kill_switch', 'bounded_action', { simulation: true, approvalToken: 'a' }))
    expect(result.decision.reason).toBe('emergency_stop_active')
    expect(result.action.executed).toBe(false)
    expect(result.learning.demotionTriggered).toBe(true)
  })

  it('lets a human emergency stop override an otherwise permitted simulation', () => {
    const engine = new EarnedAuthorityEngine()
    expect(engine.setEmergencyStop(true, 'reviewer@example.test')).toMatchObject({ active: true, authority: 'human_override' })
    const result = engine.run(request('restart_required', 'bounded_action', { simulation: true, approvalToken: 'a' }))
    expect(result.decision.reason).toBe('emergency_stop_active')
    expect(result.action.executed).toBe(false)
  })

  it('rolls back and demotes after failed validation', () => {
    const result = new EarnedAuthorityEngine().run(request('validation_failure', 'validate_or_rollback', { simulation: true, approvalToken: 'a' }))
    expect(result.validation).toEqual({ passed: false, rollbackTriggered: true, rollbackPassed: true })
    expect(result.learning.demotionTriggered).toBe(true)
  })

  it('prevents reuse of single-use approval', () => {
    const engine = new EarnedAuthorityEngine()
    engine.run(request('restart_required', 'bounded_action', { simulation: true, approvalToken: 'a' }))
    const result = engine.run(request('restart_required', 'bounded_action', { simulation: true, approvalToken: 'a', idempotencyKey: 'different' }))
    expect(result.decision.reason).toBe('approval_token_already_used')
  })

  it('returns the same record for a repeated idempotency key', () => {
    const engine = new EarnedAuthorityEngine()
    const first = engine.run(request('restart_required', 'bounded_action', { simulation: true, approvalToken: 'a' }))
    const second = engine.run(request('validation_failure', 'learn', { idempotencyKey: first.idempotencyKey, approvalToken: 'b', simulation: true }))
    expect(second).toEqual(first)
  })

  it('maintains an append-only hash link', () => {
    const engine = new EarnedAuthorityEngine()
    engine.run(request('healthy', 'observe'))
    engine.run(request('policy_denied', 'recommend'))
    expect(engine.verifyChain()).toBe(true)
  })
})
