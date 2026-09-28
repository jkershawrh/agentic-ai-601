import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

const directory = resolve(process.cwd(), 'contracts')
const files = readdirSync(directory).filter((file) => file.endsWith('.json')).sort()
if (files.length < 6) throw new Error('Expected at least six Agentic AI 601 contracts')
for (const file of files) JSON.parse(readFileSync(resolve(directory, file), 'utf8'))

const ladder = JSON.parse(readFileSync(resolve(directory, 'authority-ladder.v1.json'), 'utf8'))
const policy = JSON.parse(readFileSync(resolve(directory, 'deterministic-policy.v1.json'), 'utf8'))
const evaluation = JSON.parse(readFileSync(resolve(directory, 'evaluation-matrix.v1.json'), 'utf8'))
const research = JSON.parse(readFileSync(resolve(directory, 'research-boundary.v1.json'), 'utf8'))

if (ladder.executionAuthorityEnabled !== false) throw new Error('Execution authority must remain disabled')
if (policy.defaultDecision !== 'deny') throw new Error('Policy must deny by default')
if (evaluation.automaticPromotionForbidden !== true) throw new Error('Automatic promotion must be forbidden')
for (const name of ['GCL', 'agentPassport', 'immutableLedger', 'rossoctl', 'OpenShell']) {
  if (!research.researchConcepts[name]) throw new Error(`Missing research label: ${name}`)
}
process.stdout.write(`Validated ${files.length} contracts; execution authority remains disabled.\n`)
