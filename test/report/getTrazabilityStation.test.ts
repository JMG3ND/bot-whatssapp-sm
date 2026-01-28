import { describe, it, expect } from 'vitest'
import { getTrazabilityStation } from '../../src/core/reports/trazability/getTrazabilityStation'

describe('getTrazabilityStation', () => {
  it('Genera el reporte de trazabilidad según la estación', async () => {
    const station = 'bodega2'
    const report = await getTrazabilityStation(station)

    expect(report).toBeDefined()
    if (typeof report === 'string')
      expect(report).toBe(`El dís de hoy no se encontraron datos de trazabilidad para la estación "${station}".`)
    else
      expect(Array.isArray(report)).toBe(true)
  })

  it('Maneja estación inválida', async () => {
    const station = 'estacion-invalida'
    const report = await getTrazabilityStation(station)
    expect(report).toBe(`La estación "${station}" no es válida.`)
  })
})
