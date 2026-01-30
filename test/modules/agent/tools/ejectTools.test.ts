import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ChatCompletionMessageToolCall } from '../../../../src/modules/agent/types'

// Mocks de las funciones de herramientas
const mockObtenerStockInventario = vi.fn()
const mockObtenerInformeTrazabilidad = vi.fn()

vi.mock('../../../../src/modules/agent/tools/functions', () => ({
  obtenerStockInventario: (args: string) => mockObtenerStockInventario(args),
  obtenerInformeTrazabilidad: (args: string) => mockObtenerInformeTrazabilidad(args),
}))

import { ejectTools } from '../../../../src/modules/agent/tools/ejectTools'

describe('ejectTools', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Casos exitosos - obtener_stock_inventario', () => {
    it('debería procesar correctamente una llamada a obtener_stock_inventario', async () => {
      const toolCalls: ChatCompletionMessageToolCall[] = [
        {
          id: 'call_123',
          type: 'function',
          function: {
            name: 'obtener_stock_inventario',
            arguments: JSON.stringify({ descripción: 'corvina' }),
          },
        },
      ]

      mockObtenerStockInventario.mockResolvedValue('Tool: obtener_stock_inventario\nResultado:\n[{"stock": 100}]')

      const result = await ejectTools(toolCalls)

      expect(mockObtenerStockInventario).toHaveBeenCalledTimes(1)
      expect(mockObtenerStockInventario).toHaveBeenCalledWith(JSON.stringify({ descripción: 'corvina' }))
      expect(result).toContain('Tool: obtener_stock_inventario')
    })

    it('debería procesar llamada con descripción inválida', async () => {
      const toolCalls: ChatCompletionMessageToolCall[] = [
        {
          id: 'call_456',
          type: 'function',
          function: {
            name: 'obtener_stock_inventario',
            arguments: JSON.stringify({ descripción: 'invalido' }),
          },
        },
      ]

      mockObtenerStockInventario.mockResolvedValue('Tool: obtener_stock_inventario\nResultado:\n"No existe producto con la descripción o upc: \\"invalido\\"."')

      const result = await ejectTools(toolCalls)

      expect(result).toContain('Tool: obtener_stock_inventario')
      expect(mockObtenerStockInventario).toHaveBeenCalledWith(JSON.stringify({ descripción: 'invalido' }))
    })

    it('debería procesar descripción con caracteres especiales', async () => {
      const toolCalls: ChatCompletionMessageToolCall[] = [
        {
          id: 'call_789',
          type: 'function',
          function: {
            name: 'obtener_stock_inventario',
            arguments: JSON.stringify({ descripción: 'corvina-especial-#1' }),
          },
        },
      ]

      mockObtenerStockInventario.mockResolvedValue('Tool: obtener_stock_inventario\nResultado:\n[{"stock": 50}]')

      const result = await ejectTools(toolCalls)

      expect(result).toContain('Tool: obtener_stock_inventario')
      expect(mockObtenerStockInventario).toHaveBeenCalledTimes(1)
    })

    it('debería procesar descripción con espacios', async () => {
      const toolCalls: ChatCompletionMessageToolCall[] = [
        {
          id: 'call_101',
          type: 'function',
          function: {
            name: 'obtener_stock_inventario',
            arguments: JSON.stringify({ descripción: 'corvina roja' }),
          },
        },
      ]

      mockObtenerStockInventario.mockResolvedValue('Tool: obtener_stock_inventario\nResultado:\n[{"stock": 25}]')

      const result = await ejectTools(toolCalls)

      expect(result).toContain('Tool: obtener_stock_inventario')
    })
  })

  describe('Casos exitosos - ejecutar_informe_trazabilidad', () => {
    it('debería procesar correctamente una llamada a ejecutar_informe_trazabilidad', async () => {
      const toolCalls: ChatCompletionMessageToolCall[] = [
        {
          id: 'call_traz_1',
          type: 'function',
          function: {
            name: 'ejecutar_informe_trazabilidad',
            arguments: JSON.stringify({ station: 'bodega' }),
          },
        },
      ]

      mockObtenerInformeTrazabilidad.mockResolvedValue('Tool: obtener_informe_trazabilidad\nResultado:\n"Informe generado"')

      const result = await ejectTools(toolCalls)

      expect(mockObtenerInformeTrazabilidad).toHaveBeenCalledTimes(1)
      expect(mockObtenerInformeTrazabilidad).toHaveBeenCalledWith(JSON.stringify({ station: 'bodega' }))
      expect(result).toContain('Tool: obtener_informe_trazabilidad')
    })

    it('debería procesar llamada con estación y fecha', async () => {
      const toolCalls: ChatCompletionMessageToolCall[] = [
        {
          id: 'call_traz_2',
          type: 'function',
          function: {
            name: 'ejecutar_informe_trazabilidad',
            arguments: JSON.stringify({ station: 'bodega', date: '2026-01-30' }),
          },
        },
      ]

      mockObtenerInformeTrazabilidad.mockResolvedValue('Tool: obtener_informe_trazabilidad\nResultado:\n"Informe con fecha"')

      const result = await ejectTools(toolCalls)

      expect(result).toContain('Tool: obtener_informe_trazabilidad')
      expect(mockObtenerInformeTrazabilidad).toHaveBeenCalledWith(JSON.stringify({ station: 'bodega', date: '2026-01-30' }))
    })

    it('debería procesar diferentes estaciones', async () => {
      const stations = ['bodega', 'bodega2', 'congelado', 'fileteo', 'bandejeo']

      for (const station of stations) {
        vi.clearAllMocks()
        const toolCalls: ChatCompletionMessageToolCall[] = [
          {
            id: `call_${station}`,
            type: 'function',
            function: {
              name: 'ejecutar_informe_trazabilidad',
              arguments: JSON.stringify({ station }),
            },
          },
        ]

        mockObtenerInformeTrazabilidad.mockResolvedValue(`Tool: obtener_informe_trazabilidad\nResultado:\n"Informe ${station}"`)

        const result = await ejectTools(toolCalls)

        expect(result).toContain('Tool: obtener_informe_trazabilidad')
        expect(mockObtenerInformeTrazabilidad).toHaveBeenCalledWith(JSON.stringify({ station }))
      }
    })
  })

  describe('Casos con múltiples herramientas', () => {
    it('debería procesar múltiples llamadas a herramientas', async () => {
      const toolCalls: ChatCompletionMessageToolCall[] = [
        {
          id: 'call_1',
          type: 'function',
          function: {
            name: 'obtener_stock_inventario',
            arguments: JSON.stringify({ descripción: 'producto1' }),
          },
        },
        {
          id: 'call_2',
          type: 'function',
          function: {
            name: 'obtener_stock_inventario',
            arguments: JSON.stringify({ descripción: 'producto2' }),
          },
        },
      ]

      mockObtenerStockInventario
        .mockResolvedValueOnce('Tool: obtener_stock_inventario\nResultado:\n[{"stock": 10}]')
        .mockResolvedValueOnce('Tool: obtener_stock_inventario\nResultado:\n[{"stock": 20}]')

      const result = await ejectTools(toolCalls)

      expect(mockObtenerStockInventario).toHaveBeenCalledTimes(2)
      expect(result).toContain('Tool: obtener_stock_inventario')
      expect(result.split('\n').length).toBeGreaterThan(2)
    })

    it('debería procesar herramientas mixtas', async () => {
      const toolCalls: ChatCompletionMessageToolCall[] = [
        {
          id: 'call_stock',
          type: 'function',
          function: {
            name: 'obtener_stock_inventario',
            arguments: JSON.stringify({ descripción: 'corvina' }),
          },
        },
        {
          id: 'call_traz',
          type: 'function',
          function: {
            name: 'ejecutar_informe_trazabilidad',
            arguments: JSON.stringify({ station: 'bodega' }),
          },
        },
      ]

      mockObtenerStockInventario.mockResolvedValue('Tool: obtener_stock_inventario\nResultado:\n[{"stock": 100}]')
      mockObtenerInformeTrazabilidad.mockResolvedValue('Tool: obtener_informe_trazabilidad\nResultado:\n"Informe generado"')

      const result = await ejectTools(toolCalls)

      expect(mockObtenerStockInventario).toHaveBeenCalledTimes(1)
      expect(mockObtenerInformeTrazabilidad).toHaveBeenCalledTimes(1)
      expect(result).toContain('Tool: obtener_stock_inventario')
      expect(result).toContain('Tool: obtener_informe_trazabilidad')
    })

    it('debería unir resultados con saltos de línea', async () => {
      const toolCalls: ChatCompletionMessageToolCall[] = [
        {
          id: 'call_1',
          type: 'function',
          function: {
            name: 'obtener_stock_inventario',
            arguments: JSON.stringify({ descripción: 'item1' }),
          },
        },
        {
          id: 'call_2',
          type: 'function',
          function: {
            name: 'obtener_stock_inventario',
            arguments: JSON.stringify({ descripción: 'item2' }),
          },
        },
      ]

      mockObtenerStockInventario
        .mockResolvedValueOnce('Resultado 1')
        .mockResolvedValueOnce('Resultado 2')

      const result = await ejectTools(toolCalls)

      expect(result).toBe('Resultado 1\nResultado 2')
    })
  })

  describe('Casos de herramientas desconocidas', () => {
    it('debería manejar herramienta desconocida', async () => {
      const toolCalls: ChatCompletionMessageToolCall[] = [
        {
          id: 'call_unknown',
          type: 'function',
          function: {
            name: 'herramienta_inexistente',
            arguments: JSON.stringify({ param: 'valor' }),
          },
        },
      ]

      const result = await ejectTools(toolCalls)

      expect(result).toContain('Herramienta desconocida: herramienta_inexistente')
      expect(mockObtenerStockInventario).not.toHaveBeenCalled()
      expect(mockObtenerInformeTrazabilidad).not.toHaveBeenCalled()
    })

    it('debería manejar múltiples herramientas desconocidas', async () => {
      const toolCalls: ChatCompletionMessageToolCall[] = [
        {
          id: 'call_1',
          type: 'function',
          function: {
            name: 'herramienta_1',
            arguments: '{}',
          },
        },
        {
          id: 'call_2',
          type: 'function',
          function: {
            name: 'herramienta_2',
            arguments: '{}',
          },
        },
      ]

      const result = await ejectTools(toolCalls)

      expect(result).toContain('Herramienta desconocida: herramienta_1')
      expect(result).toContain('Herramienta desconocida: herramienta_2')
    })

    it('debería procesar herramientas conocidas y desconocidas juntas', async () => {
      const toolCalls: ChatCompletionMessageToolCall[] = [
        {
          id: 'call_known',
          type: 'function',
          function: {
            name: 'obtener_stock_inventario',
            arguments: JSON.stringify({ descripción: 'test' }),
          },
        },
        {
          id: 'call_unknown',
          type: 'function',
          function: {
            name: 'herramienta_desconocida',
            arguments: '{}',
          },
        },
      ]

      mockObtenerStockInventario.mockResolvedValue('Tool: obtener_stock_inventario\nResultado:\n[{"stock": 5}]')

      const result = await ejectTools(toolCalls)

      expect(result).toContain('Tool: obtener_stock_inventario')
      expect(result).toContain('Herramienta desconocida: herramienta_desconocida')
      expect(mockObtenerStockInventario).toHaveBeenCalledTimes(1)
    })
  })

  describe('Casos especiales', () => {
    it('debería retornar string vacío cuando no hay toolCalls', async () => {
      const toolCalls: ChatCompletionMessageToolCall[] = []

      const result = await ejectTools(toolCalls)

      expect(result).toBe('')
      expect(mockObtenerStockInventario).not.toHaveBeenCalled()
      expect(mockObtenerInformeTrazabilidad).not.toHaveBeenCalled()
    })

    it('debería procesar toolCalls con type diferente de function', async () => {
      const toolCalls: ChatCompletionMessageToolCall[] = [
        {
          id: 'call_other',
          type: 'other' as 'function',
          function: {
            name: 'obtener_stock_inventario',
            arguments: JSON.stringify({ descripción: 'test' }),
          },
        },
      ]

      const result = await ejectTools(toolCalls)

      expect(result).toBe('')
      expect(mockObtenerStockInventario).not.toHaveBeenCalled()
    })

    it('debería procesar correctamente argumentos con caracteres escapados', async () => {
      const toolCalls: ChatCompletionMessageToolCall[] = [
        {
          id: 'call_escaped',
          type: 'function',
          function: {
            name: 'obtener_stock_inventario',
            arguments: JSON.stringify({ descripción: 'producto "especial"' }),
          },
        },
      ]

      mockObtenerStockInventario.mockResolvedValue('Tool: obtener_stock_inventario\nResultado:\n[]')

      const result = await ejectTools(toolCalls)

      expect(result).toContain('Tool: obtener_stock_inventario')
      expect(mockObtenerStockInventario).toHaveBeenCalledWith(JSON.stringify({ descripción: 'producto "especial"' }))
    })

    it('debería procesar argumentos con saltos de línea', async () => {
      const toolCalls: ChatCompletionMessageToolCall[] = [
        {
          id: 'call_multiline',
          type: 'function',
          function: {
            name: 'obtener_stock_inventario',
            arguments: JSON.stringify({ descripción: 'línea1\nlínea2' }),
          },
        },
      ]

      mockObtenerStockInventario.mockResolvedValue('Tool: obtener_stock_inventario\nResultado:\n[]')

      const result = await ejectTools(toolCalls)

      expect(result).toContain('Tool: obtener_stock_inventario')
    })
  })

  describe('Casos de orden de ejecución', () => {
    it('debería ejecutar herramientas en el orden especificado', async () => {
      const executionOrder: string[] = []

      mockObtenerStockInventario.mockImplementation(async (_args: string) => {
        executionOrder.push('stock')
        return 'Stock result'
      })

      mockObtenerInformeTrazabilidad.mockImplementation(async (_args: string) => {
        executionOrder.push('trazabilidad')
        return 'Trazabilidad result'
      })

      const toolCalls: ChatCompletionMessageToolCall[] = [
        {
          id: 'call_1',
          type: 'function',
          function: {
            name: 'obtener_stock_inventario',
            arguments: JSON.stringify({ descripción: 'test1' }),
          },
        },
        {
          id: 'call_2',
          type: 'function',
          function: {
            name: 'ejecutar_informe_trazabilidad',
            arguments: JSON.stringify({ station: 'bodega' }),
          },
        },
        {
          id: 'call_3',
          type: 'function',
          function: {
            name: 'obtener_stock_inventario',
            arguments: JSON.stringify({ descripción: 'test2' }),
          },
        },
      ]

      await ejectTools(toolCalls)

      expect(executionOrder).toEqual(['stock', 'trazabilidad', 'stock'])
    })
  })
})
