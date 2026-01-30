import { describe, it, expect  } from 'vitest'
import { exectTrazabiltyStation } from '../../../../src/modules/querys/functions/exectTrazabiltyStation'

describe('exectTrazabilityStation', () => {
  it('should execute trazability station function', async () => {
    const result = await exectTrazabiltyStation('congelado')
    expect(result).toBeDefined()
  })
})
