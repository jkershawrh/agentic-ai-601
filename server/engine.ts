import { createHash, randomUUID } from 'node:crypto'
import { evaluatePolicy } from './policy.js'
import type { LoopRecord, LoopRequest } from './types.js'

const canonical = (value: unknown): string => {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`
  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>).sort(([left], [right]) => left.localeCompare(right)).map(([key, item]) => `${JSON.stringify(key)}:${canonical(item)}`).join(',')}}`
  }
  return JSON.stringify(value)
}

export class EarnedAuthorityEngine {
  private readonly records: LoopRecord[] = []
  private readonly idempotency = new Map<string, LoopRecord>()
  private readonly approvals = new Set<string>()
  private emergencyStop = false
  private emergencyStopActor = 'not-set'

  run(request: LoopRequest): LoopRecord {
    const cached = this.idempotency.get(request.idempotencyKey)
    if (cached) return cached
    const effectiveRequest = this.emergencyStop ? { ...request, scenario: 'kill_switch' as const } : request
    const policy = evaluatePolicy(effectiveRequest)
    const approvalReuse = request.approvalToken ? this.approvals.has(request.approvalToken) : false
    const disposition = approvalReuse ? 'deny' : policy.disposition
    const reason = approvalReuse ? 'approval_token_already_used' : policy.reason
    if (request.approvalToken && policy.disposition === 'simulate') this.approvals.add(request.approvalToken)

    const actionRequested = request.scenario === 'healthy' ? null : 'workload.restart'
    const actionExecuted = disposition === 'simulate'
    const validationPassed = actionExecuted ? request.scenario !== 'validation_failure' : null
    const rollbackTriggered = actionExecuted && validationPassed === false
    const demotionTriggered = request.scenario === 'kill_switch' || request.scenario === 'validation_failure' || disposition === 'deny'
    const previousHash = this.records.at(-1)?.recordHash ?? 'GENESIS'
    const unsigned = {
      schemaVersion: 'agentic-ai-601/evidence-record/v1' as const,
      recordId: randomUUID(),
      correlationId: request.correlationId,
      idempotencyKey: request.idempotencyKey,
      sourceState: 'rehearsal' as const,
      signal: {
        scenario: request.scenario,
        provenance: 'checked-in synthetic condition generator',
        conditionClass: request.scenario === 'restart_required' || request.scenario === 'validation_failure' ? 'synthetic.pod_unhealthy' : 'none',
        taxonomyVersion: 'synthetic-conditions/v1',
      },
      decision: { disposition, reason, policyVersion: 'deterministic-policy/v1', risk: actionRequested ? 'low' : 'none', confidence: null },
      action: { requested: actionRequested, executed: actionExecuted, simulated: actionExecuted, attempts: actionExecuted ? 1 : 0, targetCount: actionExecuted ? 1 : 0 },
      validation: { passed: validationPassed, rollbackTriggered, rollbackPassed: rollbackTriggered ? true : null },
      learning: { appended: true, promotionEligible: false, demotionTriggered, reviewerDisposition: 'not-reviewed' },
      authority: { requestedStage: request.requestedStage, grantedStage: approvalReuse ? 'observe' as const : policy.grantedStage, executionAuthorityEnabled: false as const, humanOverrideAvailable: true as const },
      previousHash,
    }
    const recordHash = createHash('sha256').update(canonical(unsigned)).digest('hex')
    const record: LoopRecord = { ...unsigned, recordHash }
    this.records.push(record)
    this.idempotency.set(request.idempotencyKey, record)
    return record
  }

  status() {
    return {
      schemaVersion: 'agentic-ai-601/status/v1',
      sourceState: 'rehearsal',
      executionAuthorityEnabled: false,
      prerequisites: { agentic401Certified: false, agentic501Certified: false },
      scope: 'synthetic-lab-only',
      emergencyStopActive: this.emergencyStop,
      emergencyStopActor: this.emergencyStopActor,
      evidenceRecords: this.records.length,
      researchConcepts: ['GCL', 'agent passport', 'immutable ledger', 'rossoctl', 'OpenShell integration'],
    }
  }

  setEmergencyStop(active: boolean, actor: string) {
    if (!actor.trim()) throw new Error('human_actor_required')
    this.emergencyStop = active
    this.emergencyStopActor = actor
    return { active, actor, authority: 'human_override', productionExecutionAuthority: false }
  }

  verifyChain(): boolean {
    return this.records.every((record, index) => record.previousHash === (index === 0 ? 'GENESIS' : this.records[index - 1].recordHash))
  }
}
