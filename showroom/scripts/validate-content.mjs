import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pages = path.join(root, 'modules', 'ROOT', 'pages')
const stages = ['00-preflight','01-signal','02-decision','03-authority','04-bounded-action','05-validate-rollback','06-learn-evaluate','07-close-handoff']
const nav = await readFile(path.join(root, 'modules', 'ROOT', 'nav.adoc'), 'utf8')
let cursor = -1
for (const stage of stages) {
  const next = nav.indexOf(`xref:${stage}.adoc[`)
  if (next <= cursor) throw new Error(`Navigation missing or unordered: ${stage}`)
  cursor = next
}
const inventory = (await readdir(pages)).filter((name) => name.endsWith('.adoc')).sort()
const expected = ['index.adoc', ...stages.map((stage) => `${stage}.adoc`)].sort()
if (JSON.stringify(inventory) !== JSON.stringify(expected)) throw new Error(`Unexpected page inventory: ${inventory}`)
let combined = ''
for (const file of inventory) {
  const text = await readFile(path.join(pages, file), 'utf8')
  combined += text
  if (!text.startsWith('=')) throw new Error(`${file} needs a title`)
  if (file !== 'index.adoc' && (!text.includes('== Objective') || !text.includes('== Learner checkpoint') || !text.includes('*Pass when:*'))) throw new Error(`${file} lacks its learning contract`)
}
for (const phrase of ['REHEARSAL','Production execution authority is disabled','Signal → Decision → Action → Validate → Learn','GCL','agent passport','immutable ledger','rossoctl','OpenShell','orderable: false','Automated promotion is false','No target environment or Launchpad state was changed']) {
  if (!combined.includes(phrase)) throw new Error(`Missing required boundary phrase: ${phrase}`)
}
process.stdout.write(`Showroom content valid — ${stages.length} ordered stages, research and authority boundaries present.\n`)
