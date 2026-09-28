import { useEffect, useRef, useState } from 'react'
import { getAdapter } from '../live/adapters'
import { runProof } from '../live/proof'
import type { LiveJourneyScene, ProofState } from '../types'
import { SceneFrame } from './SceneFrame'
import { TechnicalTopology } from './TechnicalTopology'

export function LiveJourney({ scene }: { scene: LiveJourneyScene }) {
  const [stepIndex, setStepIndex] = useState(-1)
  const [state, setState] = useState<ProofState>({ status: 'idle' })
  const [history, setHistory] = useState<Array<{ index: number; source: string; summary: string }>>([])
  const [showTopology, setShowTopology] = useState(false)
  const controller = useRef<AbortController | undefined>(undefined)
  const step = stepIndex >= 0 ? scene.steps[stepIndex] : undefined
  const complete = stepIndex === scene.steps.length - 1 && state.status === 'ready'

  useEffect(() => () => controller.current?.abort(), [])

  async function runStep(index: number) {
    controller.current?.abort()
    controller.current = new AbortController()
    setStepIndex(index)
    setState({ status: 'loading' })
    const next = scene.steps[index]
    const adapter = getAdapter(next.adapterId)
    if (!adapter) {
      setState({ status: 'error', error: `Adapter not registered: ${next.adapterId}` })
      return
    }
    const result = await runProof(adapter, controller.current.signal)
    setState(result)
    if (result.status === 'ready' && result.data) {
      const field = next.resultFields[0]
      setHistory((current) => [...current.filter((item) => item.index !== index), {
        index,
        source: result.source ?? 'unknown',
        summary: `${field.label}: ${String(result.data?.[field.key] ?? 'not reported')}`,
      }].sort((left, right) => left.index - right.index))
    }
  }

  return <SceneFrame scene={scene}><div className="live-workspace" data-testid="live-workspace">
    <nav className="live-workspace-steps" aria-label="Live proof progress">
      {scene.steps.map((item, index) => <button key={item.id} disabled={index > stepIndex} className={index === stepIndex ? 'active' : index < stepIndex ? 'complete' : ''} onClick={() => index < stepIndex && void runStep(index)}><span>{index < stepIndex ? '✓' : index + 1}</span>{item.title}</button>)}
    </nav>
    <div className="live-workspace-main">
      <div className="journey-status">
        <small>{step ? `ACT ${stepIndex + 1} OF ${scene.steps.length}` : 'SOURCE-LABELED REHEARSAL'}</small>
        <strong>{step?.title ?? 'Begin with a governed signal—not permission'}</strong>
        <span>{step?.detail ?? 'Run one synthetic condition, then inspect the evidence and authority boundary returned by each stage.'}</span>
        {state.source && <span className={`source-badge source-${state.source}`}>{state.source}</span>}
      </div>
      {!step && <div className="live-workspace-intake"><span>INPUT</span><strong>Versioned synthetic condition</strong><small>No LLM participates in this rehearsal. Deterministic policy and a human reviewer own the action boundary.</small></div>}
      {!scene.technicalTopology && step && <div className="live-architecture" aria-label="Live architecture journey">
      {scene.nodes.map((node, index) => <div className="live-node-wrap" key={node.id}>
        <div className={`live-node ${node.tone ? `tone-${node.tone}` : ''} ${step && index <= step.activeNode ? 'done' : ''} ${step?.activeNode === index ? 'active' : ''}`}>
          <strong>{node.label}</strong>{node.detail && <span>{node.detail}</span>}
        </div>
        {index < scene.nodes.length - 1 && <div className={`live-edge ${step && index < step.activeNode ? 'done' : ''}`}>→</div>}
      </div>)}
      </div>}
    {state.status === 'ready' && state.data && step && <div className="journey-results">
      {step.resultFields.map((field) => <div className="journey-result" key={field.key}><span>{field.label}</span><strong>{String(state.data?.[field.key] ?? '—')}{field.suffix}</strong></div>)}
    </div>}
    {state.error && <p className="fallback-note">{state.error}{state.status === 'ready' ? ' Showing clearly labeled fallback evidence.' : ''}</p>}
      <div className="journey-controls">
      {scene.technicalTopology && <button className="button button-secondary" onClick={() => setShowTopology((visible) => !visible)}>{showTopology ? 'Hide' : 'Inspect'} technical topology</button>}
      {stepIndex < 0 && <button className="button button-primary" onClick={() => runStep(0)}>{scene.cta}</button>}
      {stepIndex >= 0 && !complete && state.status !== 'loading' && <button className="button button-primary" onClick={() => runStep(stepIndex + 1)}>Next live act →</button>}
      {state.status === 'loading' && <button className="button button-primary" disabled>Running…</button>}
      {state.status === 'error' && <button className="button button-secondary" onClick={() => runStep(stepIndex)}>Retry</button>}
      {complete && <button className="button button-secondary" onClick={() => { setStepIndex(-1); setState({ status: 'idle' }); setHistory([]); setShowTopology(false) }}>Replay</button>}
      {complete && scene.workspace && <a className="button button-primary" href={scene.workspace.href}>{scene.workspace.label} →</a>}
      </div>
    </div>
    <aside className="live-workspace-context"><span>HOW IT WORKS</span><strong>Evidence accumulates</strong><p>Each stage runs a typed adapter. Results retain their source state, correlation, and authority limit.</p>
      {history.length > 0 && <div className="journey-history" aria-label="Accumulated evidence">{history.map((item) => <div key={item.index}><b>{scene.steps[item.index].title}</b><span>{item.source} · {item.summary}</span></div>)}</div>}
      <small>Current LLM role: none. Optional AI classification remains advisory and cannot grant authority.</small></aside>
  </div>
  {showTopology && scene.technicalTopology && <div className="live-topology-drawer"><TechnicalTopology topology={scene.technicalTopology} activeIds={step?.activeNodeIds ?? []} /></div>}
  </SceneFrame>
}
