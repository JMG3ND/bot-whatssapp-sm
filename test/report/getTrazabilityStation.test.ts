import { describe, it, expect } from 'vitest'
import { getTrazabilityStation } from '../../src/modules/reports/trazability/getTrazabilityStation'

describe('getTrazabilityStation', () => {
  it('Genera el reporte de trazabilidad según la estación', async () => {
    const station = 'bodega2'
    const report = await getTrazabilityStation(station)

    expect(report).toBeDefined()
    expect(typeof report).toBe('string')
  })

  it('Maneja estación inválida', async () => {
    const station = 'estacion-invalida'
    await expect(getTrazabilityStation(station))
      .rejects
      .toThrow(`La estación "${station}" no es válida.`)
  })
})
