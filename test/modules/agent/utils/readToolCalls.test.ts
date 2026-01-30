import { describe, it, expect } from 'vitest'
import { readToolCalls } from '../../../../src/modules/agent/utils/readToolCalls'
import type { ChatCompletion } from '../../../../src/modules/agent/types'

describe('readToolCalls', () => {
  describe('debería extraer tool_calls correctamente', () => {
    it('debería retornar tool_calls cuando existe una sola llamada', () => {
      const response: ChatCompletion = {
        id: 'chatcmpl-123',
        object: 'chat.completion',
        created: 1677652288,
        model: 'gpt-4',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: null,
              refusal: null,
              tool_calls: [
                {
                  id: 'call_123',
                  type: 'function',
                  function: {
                    name: 'obtenerStockInventario',
                    arguments: '{"description": "POLLO"}',
                  },
                },
              ],
            },
            finish_reason: 'tool_calls',
            logprobs: null,
          },
        ],
        usage: {
          prompt_tokens: 50,
          completion_tokens: 20,
          total_tokens: 70,
        },
      }

      const result = readToolCalls(response)
      expect(result).toBeDefined()
      expect(result).toHaveLength(1)
      expect(result?.[0].id).toBe('call_123')
      expect(result?.[0].type).toBe('function')
      if (result?.[0].type === 'function') {
        expect(result[0].function.name).toBe('obtenerStockInventario')
        expect(result[0].function.arguments).toBe('{"description": "POLLO"}')
      }
    })

    it('debería retornar múltiples tool_calls cuando existen varias llamadas', () => {
      const response: ChatCompletion = {
        id: 'chatcmpl-123',
        object: 'chat.completion',
        created: 1677652288,
        model: 'gpt-4',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: null,
              refusal: null,
              tool_calls: [
                {
                  id: 'call_123',
                  type: 'function',
                  function: {
                    name: 'obtenerStockInventario',
                    arguments: '{"description": "POLLO"}',
                  },
                },
                {
                  id: 'call_456',
                  type: 'function',
                  function: {
                    name: 'ejecutar_informe_trazabilidad',
                    arguments: '{"station": "FREEZER"}',
                  },
                },
              ],
            },
            finish_reason: 'tool_calls',
            logprobs: null,
          },
        ],
        usage: {
          prompt_tokens: 50,
          completion_tokens: 40,
          total_tokens: 90,
        },
      }

      const result = readToolCalls(response)
      expect(result).toBeDefined()
      expect(result).toHaveLength(2)
      if (result?.[0].type === 'function') {
        expect(result[0].function.name).toBe('obtenerStockInventario')
      }
      if (result?.[1].type === 'function') {
        expect(result[1].function.name).toBe('ejecutar_informe_trazabilidad')
      }
    })

    it('debería manejar tool_calls con argumentos complejos', () => {
      const response: ChatCompletion = {
        id: 'chatcmpl-123',
        object: 'chat.completion',
        created: 1677652288,
        model: 'gpt-4',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: null,
              refusal: null,
              tool_calls: [
                {
                  id: 'call_789',
                  type: 'function',
                  function: {
                    name: 'buscarProducto',
                    arguments: JSON.stringify({
                      description: 'POLLO ENTERO',
                      filters: {
                        storage: ['FREEZER', '#01'],
                        minWeight: 5,
                        maxWeight: 10,
                      },
                      limit: 20,
                    }),
                  },
                },
              ],
            },
            finish_reason: 'tool_calls',
            logprobs: null,
          },
        ],
        usage: {
          prompt_tokens: 60,
          completion_tokens: 30,
          total_tokens: 90,
        },
      }

      const result = readToolCalls(response)
      expect(result).toBeDefined()
      expect(result).toHaveLength(1)
      if (result?.[0].type === 'function') {
        expect(result[0].function.name).toBe('buscarProducto')

        const args = JSON.parse(result[0].function.arguments || '{}')
        expect(args.description).toBe('POLLO ENTERO')
        expect(args.filters.storage).toEqual(['FREEZER', '#01'])
        expect(args.limit).toBe(20)
      }
    })

    it('debería manejar tool_calls con argumentos vacíos', () => {
      const response: ChatCompletion = {
        id: 'chatcmpl-123',
        object: 'chat.completion',
        created: 1677652288,
        model: 'gpt-4',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: null,
              refusal: null,
              tool_calls: [
                {
                  id: 'call_empty',
                  type: 'function',
                  function: {
                    name: 'listarEstaciones',
                    arguments: '{}',
                  },
                },
              ],
            },
            finish_reason: 'tool_calls',
            logprobs: null,
          },
        ],
        usage: {
          prompt_tokens: 30,
          completion_tokens: 10,
          total_tokens: 40,
        },
      }

      const result = readToolCalls(response)
      expect(result).toBeDefined()
      expect(result).toHaveLength(1)
      if (result?.[0].type === 'function') {
        expect(result[0].function.arguments).toBe('{}')
      }
    })
  })

  describe('debería manejar casos donde tool_calls no existe', () => {
    it('debería retornar undefined cuando no hay tool_calls', () => {
      const response: ChatCompletion = {
        id: 'chatcmpl-123',
        object: 'chat.completion',
        created: 1677652288,
        model: 'gpt-4',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: 'Esta es una respuesta sin tool_calls',
              refusal: null,
            },
            finish_reason: 'stop',
            logprobs: null,
          },
        ],
        usage: {
          prompt_tokens: 20,
          completion_tokens: 15,
          total_tokens: 35,
        },
      }

      const result = readToolCalls(response)
      expect(result).toBeUndefined()
    })

    it('debería retornar undefined cuando message es undefined', () => {
      const response = {
        id: 'chatcmpl-123',
        object: 'chat.completion',
        created: 1677652288,
        model: 'gpt-4',
        choices: [
          {
            index: 0,
            message: undefined,
            finish_reason: 'stop',
            logprobs: null,
          },
        ],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 5,
          total_tokens: 15,
        },
      } as unknown as ChatCompletion

      const result = readToolCalls(response)
      expect(result).toBeUndefined()
    })

    it('debería retornar undefined cuando choices[0] no existe', () => {
      const response: ChatCompletion = {
        id: 'chatcmpl-123',
        object: 'chat.completion',
        created: 1677652288,
        model: 'gpt-4',
        choices: [],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 5,
          total_tokens: 15,
        },
      }

      const result = readToolCalls(response)
      expect(result).toBeUndefined()
    })

    it('debería retornar undefined cuando tool_calls es undefined', () => {
      const response: ChatCompletion = {
        id: 'chatcmpl-123',
        object: 'chat.completion',
        created: 1677652288,
        model: 'gpt-4',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: 'Respuesta normal',
              refusal: null,
              tool_calls: undefined,
            },
            finish_reason: 'stop',
            logprobs: null,
          },
        ],
        usage: {
          prompt_tokens: 20,
          completion_tokens: 10,
          total_tokens: 30,
        },
      }

      const result = readToolCalls(response)
      expect(result).toBeUndefined()
    })
  })

  describe('debería extraer solo del primer choice', () => {
    it('debería ignorar tool_calls de choices adicionales', () => {
      const response: ChatCompletion = {
        id: 'chatcmpl-123',
        object: 'chat.completion',
        created: 1677652288,
        model: 'gpt-4',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: null,
              refusal: null,
              tool_calls: [
                {
                  id: 'call_first',
                  type: 'function',
                  function: {
                    name: 'primeraFuncion',
                    arguments: '{"param": "first"}',
                  },
                },
              ],
            },
            finish_reason: 'tool_calls',
            logprobs: null,
          },
          {
            index: 1,
            message: {
              role: 'assistant',
              content: null,
              refusal: null,
              tool_calls: [
                {
                  id: 'call_second',
                  type: 'function',
                  function: {
                    name: 'segundaFuncion',
                    arguments: '{"param": "second"}',
                  },
                },
              ],
            },
            finish_reason: 'tool_calls',
            logprobs: null,
          },
        ],
        usage: {
          prompt_tokens: 40,
          completion_tokens: 30,
          total_tokens: 70,
        },
      }

      const result = readToolCalls(response)
      expect(result).toBeDefined()
      expect(result).toHaveLength(1)
      if (result?.[0].type === 'function') {
        expect(result[0].function.name).toBe('primeraFuncion')
        expect(result[0].function.name).not.toBe('segundaFuncion')
      }
    })
  })

  describe('debería manejar diferentes estructuras de tool_calls', () => {
    it('debería manejar tool_calls con IDs largos', () => {
      const response: ChatCompletion = {
        id: 'chatcmpl-123',
        object: 'chat.completion',
        created: 1677652288,
        model: 'gpt-4',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: null,
              refusal: null,
              tool_calls: [
                {
                  id: 'call_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz',
                  type: 'function',
                  function: {
                    name: 'funcionConIdLargo',
                    arguments: '{"test": true}',
                  },
                },
              ],
            },
            finish_reason: 'tool_calls',
            logprobs: null,
          },
        ],
        usage: {
          prompt_tokens: 30,
          completion_tokens: 20,
          total_tokens: 50,
        },
      }

      const result = readToolCalls(response)
      expect(result).toBeDefined()
      expect(result?.[0].id).toBe('call_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz')
    })

    it('debería manejar nombres de funciones con caracteres especiales', () => {
      const response: ChatCompletion = {
        id: 'chatcmpl-123',
        object: 'chat.completion',
        created: 1677652288,
        model: 'gpt-4',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: null,
              refusal: null,
              tool_calls: [
                {
                  id: 'call_special',
                  type: 'function',
                  function: {
                    name: 'función_con_ácentos_y_ñ',
                    arguments: '{"parámetro": "valór"}',
                  },
                },
              ],
            },
            finish_reason: 'tool_calls',
            logprobs: null,
          },
        ],
        usage: {
          prompt_tokens: 30,
          completion_tokens: 20,
          total_tokens: 50,
        },
      }

      const result = readToolCalls(response)
      expect(result).toBeDefined()
      if (result?.[0].type === 'function') {
        expect(result[0].function.name).toBe('función_con_ácentos_y_ñ')
      }
    })
  })
})
