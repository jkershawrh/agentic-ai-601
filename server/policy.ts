import type { AuthorityStage, LoopRequest } from './types.js'

const stageRank: Record<AuthorityStage, number> = {
  observe: 0,
  recommend: 1,
  shadow: 2,
  human_approval: 3,
  bounded_action: 4,
  validate_or_rollback: 5,
  learn: 6,
}

export interface PolicyResult {
  disposition: 'observe' | 'recommend' | 'shadow' | 'request_approval' | 'simulate' | 'deny'
  reason: string
  grantedStage: AuthorityStage
}

export function evaluatePolicy(request: LoopRequest): PolicyResult {
  if (request.scenario === 'kill_switch') return { disposition: 'deny', reason: 'emergency_stop_active', grantedStage: 'observe' }
  if (!/^agentic-ai-601-lab-[a-z0-9-]+$/.test(request.namespace)) return { disposition: 'deny', reason: 'namespace_out_of_scope', grantedStage: 'observe' }
  if (request.scenario === 'policy_denied') return { disposition: 'deny', reason: 'condition_or_action_not_allowlisted', grantedStage: 'observe' }
  if (request.scenario === 'healthy') return { disposition: 'observe', reason: 'no_action_required', grantedStage: 'observe' }
  if (stageRank[request.requestedStage] === 0) return { disposition: 'observe', reason: 'observe_only', grantedStage: 'observe' }
  if (stageRank[request.requestedStage] === 1) return { disposition: 'recommend', reason: 'recommendation_only', grantedStage: 'recommend' }
  if (stageRank[request.requestedStage] === 2) return { disposition: 'shadow', reason: 'shadow_evaluation_only', grantedStage: 'shadow' }
  if (!request.approvalToken) return { disposition: 'request_approval', reason: 'single_use_human_approval_required', grantedStage: 'recommend' }
  if (!request.simulation) return { disposition: 'deny', reason: 'prerequisite_certification_incomplete', grantedStage: 'human_approval' }
  return { disposition: 'simulate', reason: 'synthetic_lab_simulation_only', grantedStage: request.requestedStage }
}
