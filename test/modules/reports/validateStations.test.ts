import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock de getStationList
const mockGetStationList = vi.fn()

vi.mock('../../../src/modules/querys/functions/getStationList', () => ({
  getStationList: () => mockGetStationList(),
}))

import { validateStations } from '../../../src/modules/reports/trazability/validateStations'

describe('validateStations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Casos exitosos - Estaciones válidas', () => {
    it('debería retornar true cuando la estación existe (coincidencia exacta)', async () => {
      mockGetStationList.mockResolvedValue(['Bodega', 'Producción', 'Empaque'])

      const result = await validateStations('Bodega')

      expect(result).toBe(true)
      expect(mockGetStationList).toHaveBeenCalledTimes(1)
    })

    it('debería retornar true cuando la estación existe (sin importar mayúsculas)', async () => {
      mockGetStationList.mockResolvedValue(['Bodega', 'Producción', 'Empaque'])

      const result = await validateStations('bodega')

      expect(result).toBe(true)
    })

    it('debería retornar true cuando la estación está en mayúsculas', async () => {
      mockGetStationList.mockResolvedValue(['Bodega', 'Producción', 'Empaque'])

      const result = await validateStations('BODEGA')

      expect(result).toBe(true)
    })

    it('debería retornar true cuando la estación tiene mezcla de mayúsculas y minúsculas', async () => {
      mockGetStationList.mockResolvedValue(['Bodega', 'Producción', 'Empaque'])

      const result = await validateStations('BoDEgA')

      expect(result).toBe(true)
    })

    it('debería retornar true para estaciones con acentos', async () => {
      mockGetStationList.mockResolvedValue(['Bodega', 'Producción', 'Empaque'])

      const result = await validateStations('Producción')

      expect(result).toBe(true)
    })

    it('debería retornar true para estaciones con caracteres especiales', async () => {
      mockGetStationList.mockResolvedValue(['Bodega-Principal', 'Producción #1', 'Empaque & Envío'])

      const result = await validateStations('Bodega-Principal')

      expect(result).toBe(true)
    })

    it('debería retornar true para estaciones con espacios', async () => {
      mockGetStationList.mockResolvedValue(['Bodega Principal', 'Sala de Producción', 'Empaque Final'])

      const result = await validateStations('Bodega Principal')

      expect(result).toBe(true)
    })

    it('debería retornar true para estaciones con números', async () => {
      mockGetStationList.mockResolvedValue(['Bodega1', 'Bodega2', 'Bodega3'])

      const result = await validateStations('Bodega2')

      expect(result).toBe(true)
    })

    it('debería retornar true cuando hay una sola estación en la lista', async () => {
      mockGetStationList.mockResolvedValue(['Única'])

      const result = await validateStations('Única')

      expect(result).toBe(true)
    })

    it('debería retornar true cuando la estación está al inicio de la lista', async () => {
      mockGetStationList.mockResolvedValue(['Primera', 'Segunda', 'Tercera'])

      const result = await validateStations('Primera')

      expect(result).toBe(true)
    })

    it('debería retornar true cuando la estación está al final de la lista', async () => {
      mockGetStationList.mockResolvedValue(['Primera', 'Segunda', 'Tercera'])

      const result = await validateStations('Tercera')

      expect(result).toBe(true)
    })

    it('debería retornar true cuando la estación está en medio de la lista', async () => {
      mockGetStationList.mockResolvedValue(['Primera', 'Segunda', 'Tercera'])

      const result = await validateStations('Segunda')

      expect(result).toBe(true)
    })
  })

  describe('Casos exitosos - Estaciones inválidas', () => {
    it('debería retornar false cuando la estación no existe', async () => {
      mockGetStationList.mockResolvedValue(['Bodega', 'Producción', 'Empaque'])

      const result = await validateStations('Almacén')

      expect(result).toBe(false)
      expect(mockGetStationList).toHaveBeenCalledTimes(1)
    })

    it('debería retornar false cuando la lista de estaciones está vacía', async () => {
      mockGetStationList.mockResolvedValue([])

      const result = await validateStations('Bodega')

      expect(result).toBe(false)
    })

    it('debería retornar false para una estación parcialmente correcta', async () => {
      mockGetStationList.mockResolvedValue(['Bodega', 'Producción', 'Empaque'])

      const result = await validateStations('Bod')

      expect(result).toBe(false)
    })

    it('debería retornar false para una estación con espacios extras', async () => {
      mockGetStationList.mockResolvedValue(['Bodega', 'Producción', 'Empaque'])

      const result = await validateStations('Bodega ')

      expect(result).toBe(false)
    })

    it('debería retornar false para una estación con prefijo', async () => {
      mockGetStationList.mockResolvedValue(['Bodega', 'Producción', 'Empaque'])

      const result = await validateStations('La Bodega')

      expect(result).toBe(false)
    })

    it('debería retornar false para un string vacío', async () => {
      mockGetStationList.mockResolvedValue(['Bodega', 'Producción', 'Empaque'])

      const result = await validateStations('')

      expect(result).toBe(false)
    })

    it('debería retornar false cuando la estación tiene caracteres diferentes', async () => {
      mockGetStationList.mockResolvedValue(['Bodega', 'Producción', 'Empaque'])

      const result = await validateStations('Bodega-2')

      expect(result).toBe(false)
    })
  })

  describe('Casos especiales', () => {
    it('debería manejar lista con muchas estaciones', async () => {
      const manyStations = Array.from({ length: 100 }, (_, i) => `Estación${i}`)
      mockGetStationList.mockResolvedValue(manyStations)

      const result = await validateStations('Estación50')

      expect(result).toBe(true)
    })

    it('debería manejar estaciones con nombres muy largos', async () => {
      const longName = 'Esta es una estación con un nombre extremadamente largo que debería ser manejado correctamente'
      mockGetStationList.mockResolvedValue([longName])

      const result = await validateStations(longName)

      expect(result).toBe(true)
    })

    it('debería llamar a getStationList una vez por validación', async () => {
      mockGetStationList.mockResolvedValue(['Bodega', 'Producción'])

      await validateStations('Bodega')

      expect(mockGetStationList).toHaveBeenCalledTimes(1)
    })

    it('debería manejar estaciones con caracteres Unicode', async () => {
      mockGetStationList.mockResolvedValue(['Bodega 你好', 'Producción مرحبا'])

      const result = await validateStations('Bodega 你好')

      expect(result).toBe(true)
    })

    it('debería manejar estaciones con emojis', async () => {
      mockGetStationList.mockResolvedValue(['Bodega 📦', 'Producción 🏭'])

      const result = await validateStations('Bodega 📦')

      expect(result).toBe(true)
    })

    it('debería ser case-insensitive con caracteres especiales', async () => {
      mockGetStationList.mockResolvedValue(['Bodega-Principal', 'Producción #1'])

      const result = await validateStations('BODEGA-PRINCIPAL')

      expect(result).toBe(true)
    })
  })

  describe('Casos de error', () => {
    it('debería propagar el error si getStationList falla', async () => {
      mockGetStationList.mockRejectedValue(new Error('Error de base de datos'))

      await expect(validateStations('Bodega')).rejects.toThrow('Error de base de datos')
    })

    it('debería intentar obtener la lista aunque falle', async () => {
      mockGetStationList.mockRejectedValue(new Error('Error de conexión'))

      try {
        await validateStations('Bodega')
      } catch {
        // Esperamos el error
      }

      expect(mockGetStationList).toHaveBeenCalledTimes(1)
    })
  })

  describe('Validación de normalización', () => {
    it('debería normalizar correctamente nombres con mayúsculas mezcladas', async () => {
      mockGetStationList.mockResolvedValue(['BoDegA', 'ProDuCCióN'])

      const result1 = await validateStations('bodega')
      const result2 = await validateStations('PRODUCCIÓN')

      expect(result1).toBe(true)
      expect(result2).toBe(true)
    })

    it('debería comparar correctamente después de normalizar', async () => {
      mockGetStationList.mockResolvedValue(['BODEGA', 'PRODUCCIÓN'])

      const result = await validateStations('bodega')

      expect(result).toBe(true)
    })

    it('debería manejar lista con elementos duplicados (diferentes casos)', async () => {
      mockGetStationList.mockResolvedValue(['Bodega', 'BODEGA', 'bodega'])

      const result = await validateStations('BoDEgA')

      expect(result).toBe(true)
    })
  })
})
