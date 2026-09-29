import { execFileSync } from 'node:child_process'

const rendered = execFileSync(
  'helm',
  [
    'template',
    'agentic-ai-601',
    'charts/agentic-ai-601',
    '--namespace',
    'launchpad-flightpath-candida-agentic-ai-601-123456',
  ],
  { encoding: 'utf8' },
)

for (const expected of [
  'kind: Route',
  'name: agentic-ai-601-presentation',
  'name: agentic-ai-601-qualifier',
  'a601p-1-123456.apps.flightpath.fm2aihpcsed.com',
  'a601q-1-123456.apps.flightpath.fm2aihpcsed.com',
]) {
  if (!rendered.includes(expected)) {
    throw new Error(`rendered chart is missing ${expected}`)
  }
}

console.log('Helm route contract verified for presentation and qualifier.')
