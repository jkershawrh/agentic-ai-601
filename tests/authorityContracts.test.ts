import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const contract = (path: string) => JSON.parse(readFileSync(resolve(process.cwd(), path), 'utf8'))

describe('Agentic AI 601 authority contracts', () => {
  it('defines a reversible earned-authority ladder', () => {
    const ladder = contract('contracts/authority-ladder.v1.json')
    expect(ladder.stages.map((stage: { id: string }) => stage.id)).toEqual([
      'observe',
      'recommend',
      'shadow',
      'human_approval',
      'bounded_action',
      'validate_or_rollback',
      'learn',
    ])
    expect(ladder.promotion.humanOwned).toBe(true)
    expect(ladder.demotion.automatic).toBe(true)
    expect(ladder.envelope).toMatchObject({ approvalTtlSeconds: 300, maxActionDurationSeconds: 2, maxTargets: 1, maxConcurrency: 1, singleUse: true, transferable: false })
  })

  it('fails closed on policy, evidence, scope, and kill-switch gaps', () => {
    const policy = contract('contracts/deterministic-policy.v1.json')
    expect(policy.defaultDecision).toBe('deny')
    expect(policy.requiredChecks).toEqual(expect.arrayContaining([
      'prerequisite_certification',
      'condition_class',
      'action_allowlist',
      'authority_envelope',
      'blast_radius',
      'concurrency',
      'idempotency',
      'emergency_stop',
    ]))
  })

  it('binds signal, decision, action, validation, rollback, and learning evidence', () => {
    const evidence = contract('contracts/evidence-record.schema.json')
    expect(evidence.required).toEqual(expect.arrayContaining([
      'correlationId',
      'idempotencyKey',
      'signal',
      'decision',
      'action',
      'validation',
      'learning',
    ]))
  })

  it('limits the only action to one reversible, idempotent, timed attempt', () => {
    const catalog = contract('contracts/action-catalog.v1.json')
    expect(catalog.actions).toHaveLength(1)
    expect(catalog.actions[0]).toMatchObject({ reversible: true, idempotent: true, timeoutMs: 2000, maxAttempts: 1, blastRadius: { maxTargets: 1, maxConcurrency: 1 } })
  })
})
