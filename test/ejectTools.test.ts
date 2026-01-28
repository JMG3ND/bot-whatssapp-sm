import { describe, it, expect } from 'vitest'
import { ejectTools } from '../src/modules/agent/tools/ejectTools'
import type { ChatCompletionMessageToolCall } from '../src/modules/agent/types'

describe('ejectTools', () => {
  it('Debería procesar llamadas a herramientas y devolver resultados formateados', async () => {
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
    const result = await ejectTools(toolCalls)
    expect(result).toContain('Tool: obtener_stock_inventario')
  })

  it('Debería procesar llamadas a herramientas y devolver resultados formateados', async () => {
    const toolCalls: ChatCompletionMessageToolCall[] = [
      {
        id: 'call_123',
        type: 'function',
        function: {
          name: 'obtener_stock_inventario',
          arguments: JSON.stringify({ descripción: 'invalido' }),
        },
      },
    ]
    const result = await ejectTools(toolCalls)
    expect(result).toContain('Tool: obtener_stock_inventario')
  })
})
