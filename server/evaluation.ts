export interface ClassEvaluation {
  cases: number
  precision: number
  recall: number
  extractionAccuracy: number
  calibrationError: number
  abstentionQuality: number
  policyCompliance: number
  validationSuccess: number
  unauthorizedActions: number
}

export interface PromotionContext {
  prerequisitesCertified: boolean
  humanApproved: boolean
  conditionClass: string
  evaluationSetVersion: string
}

const finiteUnit = (value: number) => Number.isFinite(value) && value >= 0 && value <= 1

export function evaluatePromotion(metrics: ClassEvaluation, context: PromotionContext) {
  const failures: string[] = []
  if (!context.prerequisitesCertified) failures.push('prerequisite_certification')
  if (!context.humanApproved) failures.push('human_approval')
  if (context.conditionClass !== 'synthetic.pod_unhealthy') failures.push('condition_class')
  if (!context.evaluationSetVersion) failures.push('evaluation_set_version')
  if (!Number.isInteger(metrics.cases) || metrics.cases < 50) failures.push('minimum_cases')
  if (!finiteUnit(metrics.precision) || metrics.precision < 0.98) failures.push('precision')
  if (!finiteUnit(metrics.recall) || metrics.recall < 0.95) failures.push('recall')
  if (!finiteUnit(metrics.extractionAccuracy) || metrics.extractionAccuracy < 0.98) failures.push('extraction_accuracy')
  if (!finiteUnit(metrics.calibrationError) || metrics.calibrationError > 0.05) failures.push('calibration_error')
  if (!finiteUnit(metrics.abstentionQuality) || metrics.abstentionQuality < 0.95) failures.push('abstention_quality')
  if (metrics.policyCompliance !== 1) failures.push('policy_compliance')
  if (!finiteUnit(metrics.validationSuccess) || metrics.validationSuccess < 0.99) failures.push('validation_success')
  if (metrics.unauthorizedActions !== 0) failures.push('unauthorized_actions')
  return { eligible: failures.length === 0, failures, automaticPromotion: false, scope: `${context.conditionClass}:${context.evaluationSetVersion}` }
}
