import { describe, it, expect } from 'vitest'
import { getFrozenPacking } from '../../../../src/modules/querys/functions/getFrozenPacking'

describe('getFrozenPacking', () => {
  it('debería retornar una lista de productos empacados en la estación de congelado sin fecha', async () => {
    const result = await getFrozenPacking()
    expect(Array.isArray(result)).toBe(true)
  })
})
