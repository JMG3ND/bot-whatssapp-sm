import { describe, it, expect } from 'vitest'
import { getStationList } from '../../../../src/modules/querys/functions/getStationList'

describe('getStationList', () => {
  it('Debe retornar una lista con StationName válidas', async () => {
    const stations = await getStationList()
    expect(Array.isArray(stations)).toBe(true)
    stations.forEach(station => {
      expect(typeof station === 'string').toBe(true)
    })
  })
})
