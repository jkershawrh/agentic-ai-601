import type { DemoConfig } from './types'

const technicalTopology = {
  boundary: { label: 'Synthetic OpenShift lab namespace', detail: 'all mutations remain inside one disposable workload boundary' },
  entry: { id: 'signal', kind: 'evidence', label: 'Synthetic signal', detail: 'versioned condition + provenance', endpoint: 'POST /api/v1/loop/run' },
  primaryPath: [
    { id: 'classifier', kind: 'service', label: 'Classifier', detail: 'extracts one approved condition class', endpoint: ':8090', edgeLabel: 'normalize' },
    { id: 'policy', kind: 'policy', label: 'Deterministic policy', detail: 'deny-by-default risk and scope checks', endpoint: 'policy/v1', edgeLabel: 'evaluate' },
    { id: 'authority', kind: 'authority', label: 'Authority envelope', detail: 'human-owned, time-bound, revocable', endpoint: 'ladder/v1', edgeLabel: 'grant or abstain' },
    { id: 'executor', kind: 'sandbox', label: 'Bounded executor', detail: 'one allowlisted reversible lab action', endpoint: 'synthetic only', edgeLabel: 'simulate action' },
    { id: 'validator', kind: 'service', label: 'Independent validator', detail: 'checks outcome and triggers rollback', endpoint: ':8090', edgeLabel: 'verify' },
  ],
  supportPath: [
    { id: 'ledger', kind: 'evidence', label: 'Hash-linked record', detail: 'research-oriented immutable-ledger pattern', edgeLabel: 'append' },
    { id: 'stop', kind: 'control', label: 'Emergency stop', detail: 'deny and demote before action', edgeLabel: 'override' },
    { id: 'reviewer', kind: 'human', label: 'Human reviewer', detail: 'owns approval, promotion, suspension', edgeLabel: 'authorize' },
  ],
  optionalPath: { id: 'openshell', kind: 'research integration', label: 'OpenShell', detail: 'upstream alpha / OpenShift AI Developer Preview; not production authority', edgeLabel: 'future sandbox' },
}

export const demoConfig: DemoConfig = {
  id: 'agentic-ai-601',
  title: 'Agentic AI 601 — Earn the Right to Act',
  subtitle: 'A governed, reversible path from signal to bounded action',
  event: 'Agentic AI 601',
  audience: 'Platform leaders, SREs, security reviewers, and AI governance teams',
  cta: 'Prove one narrow authority envelope before granting it.',
  brand: {
    primary: { name: 'Red Hat', logo: '/logos/redhat.svg', alt: 'Red Hat' },
    partner: { name: 'Intel', logo: '/logos/intel.png', alt: 'Intel' },
    attribution: 'Red Hat × Intel',
  },
  acts: [
    { id: 'decision', label: '00', title: 'The Decision', scenes: [
      { id: 'intro', type: 'intro', beat: 'ordinary-world', title: 'Confidence is not authority', subtitle: 'An agent earns one narrow, revocable right to act through evidence—not optimism.', speakerPrompt: 'State immediately that 601 is a research qualification candidate. Real execution remains disabled while 401 and 501 certification prerequisites are incomplete.' },
      { id: 'reframe', type: 'reframe', beat: 'stakes', eyebrow: 'The autonomy trap', title: 'Close the feedback loop without opening the blast radius', before: 'Let model confidence choose and execute', after: 'Bind class, policy, evidence, approval, action, validation, and rollback', detail: 'The safe outcome may be abstain, recommend, shadow, request approval, simulate, rollback, or demote.', speakerPrompt: 'The target is not unrestricted autonomy. It is a defensible authority envelope for one approved condition and runbook.' },
    ] },
    { id: 'architecture', label: '01', title: 'Guided Authority Architecture', scenes: [
      { id: 'guided-architecture', type: 'guided-architecture', beat: 'system-reveal', eyebrow: 'Signal → Decision → Action → Validate → Learn', title: 'Every boundary must earn the next one', body: 'Reveal the evidence, policy, authority, action, validation, and human control points in order.', layers: [
        { id: 'signal-layer', component: 'Signal contract', tone: 'primary', question: 'What condition do we actually know?', answer: 'One versioned synthetic condition with provenance, correlation, taxonomy, and extracted entities.', detail: 'Ambiguous or incomplete signals abstain; they do not become action requests.', activeNodeIds: ['signal', 'classifier'] },
        { id: 'decision-layer', component: 'Deterministic decision', tone: 'primary', question: 'What keeps confidence from becoming permission?', answer: 'A deny-by-default policy checks prerequisites, class, allowlist, scope, approval, blast radius, concurrency, idempotency, and emergency stop.', detail: 'The LLM may explain or classify ambiguity; it cannot grant authority.', activeNodeIds: ['policy', 'stop'] },
        { id: 'authority-layer', component: 'Human-owned envelope', tone: 'primary', question: 'Who grants and revokes the right to act?', answer: 'A named reviewer grants a single-use, scoped, expiring envelope; failed gates demote automatically.', detail: 'Agent passport is shown only as a research pattern, not a product claim.', activeNodeIds: ['authority', 'reviewer'] },
        { id: 'action-layer', component: 'Bounded reversible action', tone: 'partner', question: 'How small can the action be?', answer: 'One idempotent restart simulation against one synthetic workload in one lab namespace.', detail: 'OpenShell is an optional research integration; the current implementation performs no external remediation.', activeNodeIds: ['executor', 'openshell'] },
        { id: 'validate-layer', component: 'Independent validation and learn', tone: 'success', question: 'How does authority shrink when the outcome is wrong?', answer: 'Independent validation triggers rollback, appends evidence, and automatically demotes the envelope.', detail: 'Learning updates evaluation data offline. The running agent cannot rewrite its own policy or promotion threshold.', activeNodeIds: ['validator', 'ledger', 'reviewer'] },
      ], technicalTopology, speakerPrompt: 'Pause on each question. Keep research concepts visibly distinct from supported OpenShift controls.' },
    ] },
    { id: 'proof', label: '02', title: 'Closed-Loop Proof', scenes: [
      { id: 'live', type: 'live-journey', beat: 'live-proof', eyebrow: 'Source-labeled qualification path', title: 'Watch authority grow—and stop—through one loop', body: 'The current service is REHEARSAL and synthetic-only. It exercises contracts without granting production authority.', cta: 'Run the governed loop', workspace: { label: 'Open the qualification workspace', href: '/api/v1/status' }, nodes: [
        { id: 'signal-node', label: 'Signal', detail: 'provenance + class', tone: 'primary' },
        { id: 'decision-node', label: 'Decision', detail: 'policy + risk', tone: 'primary' },
        { id: 'action-node', label: 'Action', detail: 'single target', tone: 'partner' },
        { id: 'validate-node', label: 'Validate', detail: 'rollback boundary', tone: 'success' },
        { id: 'learn-node', label: 'Learn', detail: 'append + demote', tone: 'success' },
      ], technicalTopology, steps: [
        { id: 'signal-step', title: 'Observe the condition', detail: 'Collect a synthetic unhealthy-workload signal without mutation.', adapterId: 'loop-observe', activeNode: 0, activeNodeIds: ['signal', 'classifier', 'ledger'], resultFields: [{ key: 'condition', label: 'Condition' }, { key: 'source', label: 'Source' }, { key: 'authority', label: 'Authority' }] },
        { id: 'decision-step', title: 'Recommend through policy', detail: 'Classify risk and produce a recommendation while execution remains unavailable.', adapterId: 'loop-recommend', activeNode: 1, activeNodeIds: ['classifier', 'policy', 'authority', 'reviewer', 'ledger'], resultFields: [{ key: 'disposition', label: 'Disposition' }, { key: 'risk', label: 'Risk' }, { key: 'reason', label: 'Policy reason' }] },
        { id: 'action-step', title: 'Use one human-approved simulation', detail: 'Exercise the allowlist, single-use approval, idempotency, and blast-radius contract in the synthetic namespace.', adapterId: 'loop-action', activeNode: 2, activeNodeIds: ['policy', 'authority', 'reviewer', 'executor', 'ledger'], resultFields: [{ key: 'executed', label: 'Simulated' }, { key: 'targets', label: 'Targets' }, { key: 'production_authority', label: 'Production authority' }] },
        { id: 'validate-step', title: 'Fail validation, rollback, and demote', detail: 'Change one condition so validation fails; the same path rolls back and removes authority.', adapterId: 'loop-rollback', activeNode: 4, activeNodeIds: ['executor', 'validator', 'ledger', 'stop', 'reviewer'], resultFields: [{ key: 'validation', label: 'Validation' }, { key: 'rollback', label: 'Rollback' }, { key: 'demotion', label: 'Demotion' }] },
      ], speakerPrompt: 'Say REHEARSAL before interpreting results. A simulated action is qualification evidence, never a production authorization.' },
      { id: 'tradeoff', type: 'tradeoff', beat: 'trials', eyebrow: 'Fail-closed outcomes', title: 'The system earns restraint before action', options: [
        { title: 'Abstain or recommend', strength: 'Incomplete or ambiguous evidence cannot mutate anything.', tradeoff: 'A human absorbs the unresolved decision.' },
        { title: 'Bounded simulation', strength: 'One approved class and reversible runbook can be exercised safely.', tradeoff: 'It proves the contract, not production readiness.' },
        { title: 'Rollback and demote', strength: 'Failed validation removes authority immediately.', tradeoff: 'Promotion waits for new class-specific evidence and human review.' },
      ], decision: 'The emergency stop and human override remain authoritative at every stage.', speakerPrompt: 'Mention the kill-switch, duplicate approval, out-of-scope namespace, and idempotency test paths.' },
    ] },
    { id: 'mechanisms', label: '03', title: 'Why It Works', scenes: [
      { id: 'mechanisms', type: 'mechanisms', beat: 'trials', eyebrow: 'Earned-autonomy mechanisms', title: 'Scope, evidence, and reversibility move together', mechanisms: [
        { id: 'scope', label: 'Class-specific authority', claim: 'Promotion binds one condition, runbook, target class, environment, and blast radius.', detail: 'Authority never transfers automatically to a new incident, tool, or namespace.', tone: 'primary' },
        { id: 'evaluation', label: 'Consequence-aware evaluation', claim: 'Precision, recall, extraction, calibration, abstention, validation, and unauthorized actions are reviewed by class.', detail: 'Draft thresholds are explicit and remain human-owned; aggregate accuracy cannot promote.', tone: 'partner' },
        { id: 'evidence', label: 'Hash-linked evidence', claim: 'Every loop preserves stable correlation and idempotency from signal through learning.', detail: 'The ledger is an architecture pattern here, not a product claim or external production service.', tone: 'success' },
      ], speakerPrompt: 'Explain that GCL, agent passport, immutable ledger, and rossoctl are research concepts; OpenShell integration is Developer Preview/upstream alpha.' },
    ] },
    { id: 'payoff', label: '04', title: 'Evidence & Handoff', scenes: [
      { id: 'payoff', type: 'evidence-payoff', beat: 'transformation', eyebrow: 'What this session established', title: 'The right to act is narrow, temporary, and revocable', adapterIds: ['loop-observe', 'loop-recommend', 'loop-action', 'loop-rollback'], fallbackLine: 'Run the governed loop to populate this research qualification record', evidenceFields: [{ key: 'disposition', label: 'Decision' }, { key: 'executed', label: 'Simulation' }, { key: 'rollback', label: 'Rollback' }, { key: 'production_authority', label: 'Production authority' }], line1: 'One synthetic condition traversed the complete governed loop.', line2: 'Production execution remains disabled until prerequisite certification and independent Launchpad review.', cta: 'Close presentation, then enter the separate 601 lab →', speakerPrompt: 'Do not call this certified or orderable. Close the presentation before handing off.' },
    ] },
  ],
  journeyHandoffs: [
    { depth: 'lab', title: 'Agentic AI 601 governed-action lab', duration: '90 minutes', question: 'Can the learner build, deny, simulate, validate, roll back, and document one authority envelope?', technology: 'Red Hat OpenShift controls · deterministic policy · synthetic workload · research-pattern evidence ledger', instruction: 'All actions remain inside the disposable lab namespace. Production execution is disabled.', href: '/' },
  ],
}
