import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = fileURLToPath(new URL('../', import.meta.url))

describe('Launchpad handoff authority boundary', () => {
  it('keeps workshop capacity at zero until Launchpad certification', () => {
    const handoff = readFileSync(`${root}handoff/launchpad-handoff.yaml`, 'utf8')
    const proposal = readFileSync(`${root}handoff/catalog-certification.proposed.yaml`, 'utf8')

    expect(handoff).toMatch(/certification_proposal:\n(?:.*\n)*?\s+max_workshop_seats: 0/)
    expect(proposal).toMatch(/max_workshop_seats: 0/)
  })

  it('does not grant catalog, provisioning, publication, or execution authority', () => {
    const handoff = readFileSync(`${root}handoff/launchpad-handoff.yaml`, 'utf8')
    const proposal = readFileSync(`${root}handoff/catalog-certification.proposed.yaml`, 'utf8')

    for (const field of [
      'orderable',
      'certified',
      'promotion_eligible',
      'may_modify_launchpad_catalog',
      'may_provision',
      'may_publish',
    ]) {
      expect(handoff).toContain(`${field}: false`)
    }
    expect(proposal).toContain('production_execution_enabled: false')
  })
})
