export type AuthorityStage = 'observe' | 'recommend' | 'human_approval' | 'bounded_action' | 'validate_or_rollback' | 'learn'
export type Scenario = 'healthy' | 'restart_required' | 'policy_denied' | 'validation_failure' | 'kill_switch'

export interface LoopRequest {
  scenario: Scenario
  requestedStage: AuthorityStage
  namespace: string
  correlationId: string
  idempotencyKey: string
  approvalToken?: string
  simulation?: boolean
}

export interface LoopRecord {
  schemaVersion: 'agentic-ai-601/evidence-record/v1'
  recordId: string
  correlationId: string
  idempotencyKey: string
  sourceState: 'rehearsal'
  signal: Record<string, unknown>
  decision: { disposition: string; reason: string; policyVersion: string; risk: string; confidence: number | null }
  action: { requested: string | null; executed: boolean; simulated: boolean; attempts: number; targetCount: number }
  validation: { passed: boolean | null; rollbackTriggered: boolean; rollbackPassed: boolean | null }
  learning: { appended: boolean; promotionEligible: boolean; demotionTriggered: boolean; reviewerDisposition: string }
  authority: { requestedStage: AuthorityStage; grantedStage: AuthorityStage; executionAuthorityEnabled: false; humanOverrideAvailable: true }
  previousHash: string
  recordHash: string
}
