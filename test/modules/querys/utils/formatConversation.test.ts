import { describe, it, expect } from 'vitest'
import { formatConversation } from '../../../../src/modules/querys/utils/formatConversation'
import type { Conversation } from '../../../../src/database/brain/client'

describe('formatConversation', () => {
  describe('debería formatear conversaciones correctamente', () => {
    it('debería formatear una sola conversación', () => {
      const conversations: Conversation[] = [
        {
          id: '1',
          chat: 'chat123',
          userName: 'Juan',
          user_message: 'Hola',
          bot_response: '¡Hola Juan! ¿En qué puedo ayudarte?',
          createdAt: new Date('2026-01-30T10:00:00.000Z'),
        },
      ]

      const result = formatConversation(conversations)
      expect(result).toBe('Juan: Hola\nBot: ¡Hola Juan! ¿En qué puedo ayudarte?')
    })

    it('debería formatear múltiples conversaciones', () => {
      const conversations: Conversation[] = [
        {
          id: '1',
          chat: 'chat123',
          userName: 'Juan',
          user_message: 'Hola',
          bot_response: '¡Hola Juan!',
          createdAt: new Date('2026-01-30T10:00:00.000Z'),
        },
        {
          id: '2',
          chat: 'chat123',
          userName: 'Juan',
          user_message: '¿Cómo estás?',
          bot_response: 'Estoy bien, gracias por preguntar',
          createdAt: new Date('2026-01-30T10:01:00.000Z'),
        },
      ]

      const result = formatConversation(conversations)
      expect(result).toBe(
        'Juan: Hola\nBot: ¡Hola Juan!\n\nJuan: ¿Cómo estás?\nBot: Estoy bien, gracias por preguntar',
      )
    })

    it('debería formatear tres o más conversaciones con doble salto de línea entre ellas', () => {
      const conversations: Conversation[] = [
        {
          id: '1',
          chat: 'chat123',
          userName: 'Juan',
          user_message: 'Mensaje 1',
          bot_response: 'Respuesta 1',
          createdAt: new Date('2026-01-30T10:00:00.000Z'),
        },
        {
          id: '2',
          chat: 'chat123',
          userName: 'Juan',
          user_message: 'Mensaje 2',
          bot_response: 'Respuesta 2',
          createdAt: new Date('2026-01-30T10:01:00.000Z'),
        },
        {
          id: '3',
          chat: 'chat123',
          userName: 'Juan',
          user_message: 'Mensaje 3',
          bot_response: 'Respuesta 3',
          createdAt: new Date('2026-01-30T10:02:00.000Z'),
        },
      ]

      const result = formatConversation(conversations)
      expect(result).toBe(
        'Juan: Mensaje 1\nBot: Respuesta 1\n\nJuan: Mensaje 2\nBot: Respuesta 2\n\nJuan: Mensaje 3\nBot: Respuesta 3',
      )
    })

    it('debería manejar diferentes nombres de usuario', () => {
      const conversations: Conversation[] = [
        {
          id: '1',
          chat: 'chat123',
          userName: 'María',
          user_message: 'Hola',
          bot_response: 'Hola María',
          createdAt: new Date('2026-01-30T10:00:00.000Z'),
        },
        {
          id: '2',
          chat: 'chat123',
          userName: 'Pedro',
          user_message: 'Hola también',
          bot_response: 'Hola Pedro',
          createdAt: new Date('2026-01-30T10:01:00.000Z'),
        },
      ]

      const result = formatConversation(conversations)
      expect(result).toBe('María: Hola\nBot: Hola María\n\nPedro: Hola también\nBot: Hola Pedro')
    })
  })

  describe('debería manejar el parámetro newMessage', () => {
    it('debería agregar un nuevo mensaje al final', () => {
      const conversations: Conversation[] = [
        {
          id: '1',
          chat: 'chat123',
          userName: 'Juan',
          user_message: 'Hola',
          bot_response: 'Hola Juan',
          createdAt: new Date('2026-01-30T10:00:00.000Z'),
        },
      ]

      const result = formatConversation(conversations, 'Juan: ¿Qué tal?')
      expect(result).toBe('Juan: Hola\nBot: Hola Juan\n\nJuan: ¿Qué tal?')
    })

    it('debería agregar un nuevo mensaje a múltiples conversaciones', () => {
      const conversations: Conversation[] = [
        {
          id: '1',
          chat: 'chat123',
          userName: 'Juan',
          user_message: 'Mensaje 1',
          bot_response: 'Respuesta 1',
          createdAt: new Date('2026-01-30T10:00:00.000Z'),
        },
        {
          id: '2',
          chat: 'chat123',
          userName: 'Juan',
          user_message: 'Mensaje 2',
          bot_response: 'Respuesta 2',
          createdAt: new Date('2026-01-30T10:01:00.000Z'),
        },
      ]

      const result = formatConversation(conversations, 'Juan: Nuevo mensaje')
      expect(result).toBe(
        'Juan: Mensaje 1\nBot: Respuesta 1\n\nJuan: Mensaje 2\nBot: Respuesta 2\n\nJuan: Nuevo mensaje',
      )
    })

    it('no debería agregar nada cuando newMessage es undefined', () => {
      const conversations: Conversation[] = [
        {
          id: '1',
          chat: 'chat123',
          userName: 'Juan',
          user_message: 'Hola',
          bot_response: 'Hola Juan',
          createdAt: new Date('2026-01-30T10:00:00.000Z'),
        },
      ]

      const result = formatConversation(conversations, undefined)
      expect(result).toBe('Juan: Hola\nBot: Hola Juan')
    })

    it('no debería agregar nada cuando newMessage es string vacío', () => {
      const conversations: Conversation[] = [
        {
          id: '1',
          chat: 'chat123',
          userName: 'Juan',
          user_message: 'Hola',
          bot_response: 'Hola Juan',
          createdAt: new Date('2026-01-30T10:00:00.000Z'),
        },
      ]

      const result = formatConversation(conversations, '')
      expect(result).toBe('Juan: Hola\nBot: Hola Juan')
    })
  })

  describe('debería manejar casos especiales', () => {
    it('debería retornar string vacío para array vacío sin newMessage', () => {
      const conversations: Conversation[] = []
      const result = formatConversation(conversations)
      expect(result).toBe('')
    })

    it('debería retornar solo el newMessage cuando array está vacío', () => {
      const conversations: Conversation[] = []
      const result = formatConversation(conversations, 'Juan: Mensaje nuevo')
      expect(result).toBe('\n\nJuan: Mensaje nuevo')
    })

    it('debería manejar mensajes con caracteres especiales', () => {
      const conversations: Conversation[] = [
        {
          id: '1',
          chat: 'chat123',
          userName: 'Juan@123',
          user_message: '¿Cómo está el clima? #clima',
          bot_response: 'El clima está soleado ☀️',
          createdAt: new Date('2026-01-30T10:00:00.000Z'),
        },
      ]

      const result = formatConversation(conversations)
      expect(result).toBe('Juan@123: ¿Cómo está el clima? #clima\nBot: El clima está soleado ☀️')
    })

    it('debería manejar mensajes largos', () => {
      const longMessage = 'A'.repeat(500)
      const longResponse = 'B'.repeat(500)
      const conversations: Conversation[] = [
        {
          id: '1',
          chat: 'chat123',
          userName: 'Usuario',
          user_message: longMessage,
          bot_response: longResponse,
          createdAt: new Date('2026-01-30T10:00:00.000Z'),
        },
      ]

      const result = formatConversation(conversations)
      expect(result).toBe(`Usuario: ${longMessage}\nBot: ${longResponse}`)
      expect(result.length).toBeGreaterThan(1000)
    })

    it('debería manejar mensajes con saltos de línea internos', () => {
      const conversations: Conversation[] = [
        {
          id: '1',
          chat: 'chat123',
          userName: 'Juan',
          user_message: 'Línea 1\nLínea 2',
          bot_response: 'Respuesta línea 1\nRespuesta línea 2',
          createdAt: new Date('2026-01-30T10:00:00.000Z'),
        },
      ]

      const result = formatConversation(conversations)
      expect(result).toBe('Juan: Línea 1\nLínea 2\nBot: Respuesta línea 1\nRespuesta línea 2')
    })

    it('debería preservar emojis en mensajes', () => {
      const conversations: Conversation[] = [
        {
          id: '1',
          chat: 'chat123',
          userName: 'Juan',
          user_message: 'Hola 👋',
          bot_response: '¡Hola! 😊',
          createdAt: new Date('2026-01-30T10:00:00.000Z'),
        },
      ]

      const result = formatConversation(conversations)
      expect(result).toBe('Juan: Hola 👋\nBot: ¡Hola! 😊')
    })
  })
})
