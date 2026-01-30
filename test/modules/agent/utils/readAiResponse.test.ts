import { describe, it, expect } from 'vitest'
import { readAiResponse } from '../../../../src/modules/agent/utils/readAiResponse'
import type { ChatCompletion } from '../../../../src/modules/agent/types'

describe('readAiResponse', () => {
  describe('debería extraer el contenido de la respuesta correctamente', () => {
    it('debería retornar el contenido cuando existe', () => {
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
              content: 'Esta es una respuesta de prueba',
              refusal: null,
            },
            finish_reason: 'stop',
            logprobs: null,
          },
        ],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30,
        },
      }

      const result = readAiResponse(response)
      expect(result).toBe('Esta es una respuesta de prueba')
    })

    it('debería retornar contenido largo correctamente', () => {
      const longContent = 'Lorem ipsum dolor sit amet, '.repeat(50)
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
              content: longContent,
              refusal: null,
            },
            finish_reason: 'stop',
            logprobs: null,
          },
        ],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30,
        },
      }

      const result = readAiResponse(response)
      expect(result).toBe(longContent)
      expect(result.length).toBeGreaterThan(1000)
    })

    it('debería manejar contenido con saltos de línea', () => {
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
              content: 'Línea 1\nLínea 2\nLínea 3',
              refusal: null,
            },
            finish_reason: 'stop',
            logprobs: null,
          },
        ],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30,
        },
      }

      const result = readAiResponse(response)
      expect(result).toBe('Línea 1\nLínea 2\nLínea 3')
    })

    it('debería manejar contenido con caracteres especiales', () => {
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
              content: '¡Hola! ¿Cómo estás? #test @usuario',
              refusal: null,
            },
            finish_reason: 'stop',
            logprobs: null,
          },
        ],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30,
        },
      }

      const result = readAiResponse(response)
      expect(result).toBe('¡Hola! ¿Cómo estás? #test @usuario')
    })

    it('debería manejar emojis en el contenido', () => {
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
              content: '¡Hola! 👋 Estoy aquí para ayudarte 😊',
              refusal: null,
            },
            finish_reason: 'stop',
            logprobs: null,
          },
        ],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30,
        },
      }

      const result = readAiResponse(response)
      expect(result).toBe('¡Hola! 👋 Estoy aquí para ayudarte 😊')
    })

    it('debería manejar código en el contenido', () => {
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
              content: '```typescript\nconst x = 5;\nconsole.log(x);\n```',
              refusal: null,
            },
            finish_reason: 'stop',
            logprobs: null,
          },
        ],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30,
        },
      }

      const result = readAiResponse(response)
      expect(result).toBe('```typescript\nconst x = 5;\nconsole.log(x);\n```')
    })
  })

  describe('debería manejar casos donde el contenido es nulo o undefined', () => {
    it('debería retornar string vacío cuando content es null', () => {
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
            },
            finish_reason: 'stop',
            logprobs: null,
          },
        ],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30,
        },
      }

      const result = readAiResponse(response)
      expect(result).toBe('')
    })

    it('debería retornar string vacío cuando content es undefined', () => {
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
            },
            finish_reason: 'stop',
            logprobs: null,
          },
        ],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30,
        },
      }

      const result = readAiResponse(response)
      expect(result).toBe('')
    })

    it('debería retornar string vacío cuando content es string vacío', () => {
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
              content: '',
              refusal: null,
            },
            finish_reason: 'stop',
            logprobs: null,
          },
        ],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30,
        },
      }

      const result = readAiResponse(response)
      expect(result).toBe('')
    })

    it('debería retornar string vacío cuando message es undefined', () => {
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
          completion_tokens: 20,
          total_tokens: 30,
        },
      } as unknown as ChatCompletion

      const result = readAiResponse(response)
      expect(result).toBe('')
    })

    it('debería retornar string vacío cuando choices[0] es undefined', () => {
      const response: ChatCompletion = {
        id: 'chatcmpl-123',
        object: 'chat.completion',
        created: 1677652288,
        model: 'gpt-4',
        choices: [],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30,
        },
      }

      const result = readAiResponse(response)
      expect(result).toBe('')
    })
  })

  describe('debería extraer solo del primer choice', () => {
    it('debería ignorar choices adicionales y tomar solo el primero', () => {
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
              content: 'Primera respuesta',
              refusal: null,
            },
            finish_reason: 'stop',
            logprobs: null,
          },
          {
            index: 1,
            message: {
              role: 'assistant',
              content: 'Segunda respuesta',
              refusal: null,
            },
            finish_reason: 'stop',
            logprobs: null,
          },
        ],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30,
        },
      }

      const result = readAiResponse(response)
      expect(result).toBe('Primera respuesta')
      expect(result).not.toBe('Segunda respuesta')
    })
  })

  describe('debería manejar diferentes tipos de finish_reason', () => {
    it('debería manejar respuesta con finish_reason "length"', () => {
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
              content: 'Respuesta truncada por longitud',
              refusal: null,
            },
            finish_reason: 'length',
            logprobs: null,
          },
        ],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30,
        },
      }

      const result = readAiResponse(response)
      expect(result).toBe('Respuesta truncada por longitud')
    })

    it('debería manejar respuesta con finish_reason "tool_calls"', () => {
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
                    name: 'get_weather',
                    arguments: '{"location": "Madrid"}',
                  },
                },
              ],
            },
            finish_reason: 'tool_calls',
            logprobs: null,
          },
        ],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30,
        },
      }

      const result = readAiResponse(response)
      expect(result).toBe('')
    })
  })
})
