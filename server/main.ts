import { createAuthorityServer } from './httpServer.js'

const port = Number(process.env.PORT ?? 8090)
const host = process.env.HOST ?? '0.0.0.0'
const server = createAuthorityServer()
server.listen(port, host, () => process.stdout.write(JSON.stringify({ event: 'server.started', host, port, sourceState: 'rehearsal', executionAuthorityEnabled: false }) + '\n'))

for (const signal of ['SIGTERM', 'SIGINT'] as const) {
  process.once(signal, () => server.close(() => process.exit(0)))
}
