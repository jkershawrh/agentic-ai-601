import { describe, expect, it } from 'vitest'
import { evaluatePromotion, type ClassEvaluation, type PromotionContext } from './evaluation.js'

const metrics: ClassEvaluation = { cases: 50, precision: 0.98, recall: 0.95, extractionAccuracy: 0.98, calibrationError: 0.05, abstentionQuality: 0.95, policyCompliance: 1, validationSuccess: 0.99, unauthorizedActions: 0 }
const context: PromotionContext = { prerequisitesCertified: true, humanApproved: true, conditionClass: 'synthetic.pod_unhealthy', evaluationSetVersion: 'synthetic-eval/v1' }

describe('class-specific promotion evaluation', () => {
  it('can recommend eligibility only when every threshold and authority gate passes', () => {
    expect(evaluatePromotion(metrics, context)).toEqual({ eligible: true, failures: [], automaticPromotion: false, scope: 'synthetic.pod_unhealthy:synthetic-eval/v1' })
  })

  it.each([
    ['precision', { precision: 0.97 }],
    ['recall', { recall: 0.94 }],
    ['extraction_accuracy', { extractionAccuracy: 0.97 }],
    ['calibration_error', { calibrationError: 0.051 }],
    ['abstention_quality', { abstentionQuality: 0.94 }],
    ['policy_compliance', { policyCompliance: 0.999 }],
    ['validation_success', { validationSuccess: 0.98 }],
    ['unauthorized_actions', { unauthorizedActions: 1 }],
    ['minimum_cases', { cases: 49 }],
  ] as const)('fails closed on %s', (failure, changed) => {
    const result = evaluatePromotion({ ...metrics, ...changed }, context)
    expect(result.eligible).toBe(false)
    expect(result.failures).toContain(failure)
  })

  it.each([
    ['prerequisite_certification', { prerequisitesCertified: false }],
    ['human_approval', { humanApproved: false }],
    ['condition_class', { conditionClass: 'production.database_failure' }],
    ['evaluation_set_version', { evaluationSetVersion: '' }],
  ] as const)('fails closed on %s authority context', (failure, changed) => {
    const result = evaluatePromotion(metrics, { ...context, ...changed })
    expect(result.eligible).toBe(false)
    expect(result.failures).toContain(failure)
  })
})
