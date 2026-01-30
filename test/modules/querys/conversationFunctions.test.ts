import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock de brainConnection
const mockConversationCreate = vi.fn()
const mockConversationFindMany = vi.fn()
const mockConversationDeleteMany = vi.fn()

// Mock de formatConversation
const mockFormatConversation = vi.fn((conversations: Array<{userName: string, user_message: string, bot_response: string}>, newMessage: string) => {
  if (conversations.length === 0) return newMessage
  return conversations.map(c =>
    `${c.userName}: ${c.user_message}\nBot: ${c.bot_response}`,
  ).join('\n\n') + `\n\n${newMessage}`
})

vi.mock('../../../src/database/index', () => ({
  brainConnection: {
    conversation: {
      create: (arg: unknown) => mockConversationCreate(arg),
      findMany: (arg: unknown) => mockConversationFindMany(arg),
      deleteMany: (arg: unknown) => mockConversationDeleteMany(arg),
    },
  },
}))

vi.mock('../../../src/database/brainConnection', () => ({
  brainConnection: {
    conversation: {
      create: (arg: unknown) => mockConversationCreate(arg),
      findMany: (arg: unknown) => mockConversationFindMany(arg),
      deleteMany: (arg: unknown) => mockConversationDeleteMany(arg),
    },
  },
}))

vi.mock('../../../src/modules/querys/utils/formatConversation', () => ({
  formatConversation: (conversations: unknown, newMessage: unknown) => mockFormatConversation(conversations as Array<{userName: string, user_message: string, bot_response: string}>, newMessage as string),
}))

import { registerConversation } from '../../../src/modules/querys/functions/registerConversation'
import { getChatConversation } from '../../../src/modules/querys/functions/getChatConversation'
import { clearConversation } from '../../../src/modules/querys/functions/clearConversation'

describe('Conversation Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('registerConversation', () => {
    describe('Casos exitosos', () => {
      it('debería crear una conversación con todos los datos', async () => {
        const mockConversation = {
          id: 1,
          chat: '5491234567890@c.us',
          userName: 'Juan Pérez',
          user_message: '¿Cuál es el stock?',
          bot_response: 'El stock actual es 100 unidades',
          createdAt: new Date('2026-01-30T10:00:00.000Z'),
        }

        mockConversationCreate.mockResolvedValue(mockConversation)

        const result = await registerConversation({
          chat: '5491234567890@c.us',
          userName: 'Juan Pérez',
          user_message: '¿Cuál es el stock?',
          bot_response: 'El stock actual es 100 unidades',
        })

        expect(mockConversationCreate).toHaveBeenCalledTimes(1)
        expect(mockConversationCreate).toHaveBeenCalledWith({
          data: {
            chat: '5491234567890@c.us',
            userName: 'Juan Pérez',
            user_message: '¿Cuál es el stock?',
            bot_response: 'El stock actual es 100 unidades',
          },
        })
        expect(result).toEqual(mockConversation)
      })

      it('debería crear una conversación con mensajes largos', async () => {
        const longMessage = 'Este es un mensaje muy largo '.repeat(50)
        const longResponse = 'Esta es una respuesta muy larga '.repeat(50)

        const mockConversation = {
          id: 2,
          chat: '5491234567890@c.us',
          userName: 'María López',
          user_message: longMessage,
          bot_response: longResponse,
          createdAt: new Date('2026-01-30T10:00:00.000Z'),
        }

        mockConversationCreate.mockResolvedValue(mockConversation)

        const result = await registerConversation({
          chat: '5491234567890@c.us',
          userName: 'María López',
          user_message: longMessage,
          bot_response: longResponse,
        })

        expect(result.user_message).toBe(longMessage)
        expect(result.bot_response).toBe(longResponse)
      })

      it('debería crear una conversación con caracteres especiales', async () => {
        const mockConversation = {
          id: 3,
          chat: '5491234567890@c.us',
          userName: 'José @#$%',
          user_message: '¿Dónde está el ítem?',
          bot_response: 'El ítem está en: ubicación №1',
          createdAt: new Date('2026-01-30T10:00:00.000Z'),
        }

        mockConversationCreate.mockResolvedValue(mockConversation)

        const result = await registerConversation({
          chat: '5491234567890@c.us',
          userName: 'José @#$%',
          user_message: '¿Dónde está el ítem?',
          bot_response: 'El ítem está en: ubicación №1',
        })

        expect(result).toEqual(mockConversation)
      })

      it('debería crear una conversación con emojis', async () => {
        const mockConversation = {
          id: 4,
          chat: '5491234567890@c.us',
          userName: 'Pedro 😊',
          user_message: '¡Hola! 👋',
          bot_response: '¡Hola! ¿En qué puedo ayudarte? 🤖',
          createdAt: new Date('2026-01-30T10:00:00.000Z'),
        }

        mockConversationCreate.mockResolvedValue(mockConversation)

        const result = await registerConversation({
          chat: '5491234567890@c.us',
          userName: 'Pedro 😊',
          user_message: '¡Hola! 👋',
          bot_response: '¡Hola! ¿En qué puedo ayudarte? 🤖',
        })

        expect(result).toEqual(mockConversation)
      })

      it('debería retornar el objeto creado con id y timestamp', async () => {
        const mockConversation = {
          id: 5,
          chat: '5491234567890@c.us',
          userName: 'Ana',
          user_message: 'Pregunta',
          bot_response: 'Respuesta',
          createdAt: new Date('2026-01-30T10:00:00.000Z'),
        }

        mockConversationCreate.mockResolvedValue(mockConversation)

        const result = await registerConversation({
          chat: '5491234567890@c.us',
          userName: 'Ana',
          user_message: 'Pregunta',
          bot_response: 'Respuesta',
        })

        expect(result).toHaveProperty('id')
        expect(result).toHaveProperty('createdAt')
        expect(result.id).toBe(5)
      })
    })

    describe('Casos de error', () => {
      it('debería propagar el error si la creación falla', async () => {
        mockConversationCreate.mockRejectedValue(new Error('Error de base de datos'))

        await expect(registerConversation({
          chat: '5491234567890@c.us',
          userName: 'Test',
          user_message: 'Test',
          bot_response: 'Test',
        })).rejects.toThrow('Error de base de datos')
      })

      it('debería intentar crear la conversación aunque falle', async () => {
        mockConversationCreate.mockRejectedValue(new Error('Error de conexión'))

        try {
          await registerConversation({
            chat: '5491234567890@c.us',
            userName: 'Test',
            user_message: 'Test',
            bot_response: 'Test',
          })
        } catch {
          // Esperamos el error
        }

        expect(mockConversationCreate).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('getChatConversation', () => {
    describe('Casos exitosos', () => {
      it('debería obtener las conversaciones de un chat y formatearlas', async () => {
        const mockConversations = [
          {
            id: 1,
            chat: '5491234567890@c.us',
            userName: 'Juan',
            user_message: 'Hola',
            bot_response: '¡Hola! ¿Cómo puedo ayudarte?',
            createdAt: new Date('2026-01-30T10:00:00.000Z'),
          },
          {
            id: 2,
            chat: '5491234567890@c.us',
            userName: 'Juan',
            user_message: '¿Cuál es el stock?',
            bot_response: 'El stock es 100 unidades',
            createdAt: new Date('2026-01-30T10:01:00.000Z'),
          },
        ]

        mockConversationFindMany.mockResolvedValue(mockConversations)

        const result = await getChatConversation('5491234567890@c.us', 'Juan', '¿Tienes más?')

        expect(mockConversationFindMany).toHaveBeenCalledTimes(1)
        expect(mockConversationFindMany).toHaveBeenCalledWith({
          where: {
            chat: '5491234567890@c.us',
          },
          take: 10,
          orderBy: {
            createdAt: 'asc',
          },
        })
        expect(result).toContain('Juan: Hola')
        expect(result).toContain('Juan: ¿Tienes más?')
      })

      it('debería limitar los resultados a 10 conversaciones', async () => {
        const mockConversations = Array.from({ length: 15 }, (_, i) => ({
          id: i + 1,
          chat: '5491234567890@c.us',
          userName: 'Test',
          user_message: `Mensaje ${i + 1}`,
          bot_response: `Respuesta ${i + 1}`,
          createdAt: new Date(`2026-01-30T10:${String(i).padStart(2, '0')}:00.000Z`),
        }))

        mockConversationFindMany.mockResolvedValue(mockConversations.slice(0, 10))

        await getChatConversation('5491234567890@c.us', 'Test', 'Nuevo mensaje')

        expect(mockConversationFindMany).toHaveBeenCalledWith(
          expect.objectContaining({
            take: 10,
          }),
        )
      })

      it('debería ordenar las conversaciones por createdAt ascendente', async () => {
        const mockConversations = [
          {
            id: 1,
            chat: '5491234567890@c.us',
            userName: 'Test',
            user_message: 'Mensaje 1',
            bot_response: 'Respuesta 1',
            createdAt: new Date('2026-01-30T10:00:00.000Z'),
          },
        ]

        mockConversationFindMany.mockResolvedValue(mockConversations)

        await getChatConversation('5491234567890@c.us', 'Test', 'Nuevo')

        expect(mockConversationFindMany).toHaveBeenCalledWith(
          expect.objectContaining({
            orderBy: {
              createdAt: 'asc',
            },
          }),
        )
      })

      it('debería manejar un chat sin conversaciones previas', async () => {
        mockConversationFindMany.mockResolvedValue([])

        const result = await getChatConversation('5491234567890@c.us', 'Nuevo Usuario', 'Primera pregunta')

        expect(mockConversationFindMany).toHaveBeenCalledTimes(1)
        expect(result).toBe('Nuevo Usuario: Primera pregunta')
      })

      it('debería incluir el nuevo mensaje en el resultado', async () => {
        const mockConversations = [
          {
            id: 1,
            chat: '5491234567890@c.us',
            userName: 'Juan',
            user_message: 'Mensaje anterior',
            bot_response: 'Respuesta anterior',
            createdAt: new Date('2026-01-30T10:00:00.000Z'),
          },
        ]

        mockConversationFindMany.mockResolvedValue(mockConversations)

        const result = await getChatConversation('5491234567890@c.us', 'Juan', 'Mensaje nuevo')

        expect(result).toContain('Juan: Mensaje nuevo')
      })

      it('debería filtrar por el chat específico', async () => {
        mockConversationFindMany.mockResolvedValue([])

        await getChatConversation('5491234567890@c.us', 'Test', 'Mensaje')

        expect(mockConversationFindMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: {
              chat: '5491234567890@c.us',
            },
          }),
        )
      })
    })

    describe('Casos de error', () => {
      it('debería propagar el error si la consulta falla', async () => {
        mockConversationFindMany.mockRejectedValue(new Error('Error de base de datos'))

        await expect(
          getChatConversation('5491234567890@c.us', 'Test', 'Mensaje'),
        ).rejects.toThrow('Error de base de datos')
      })
    })
  })

  describe('clearConversation', () => {
    describe('Casos exitosos', () => {
      it('debería eliminar todas las conversaciones de un chat específico', async () => {
        mockConversationDeleteMany.mockResolvedValue({ count: 5 })

        await clearConversation('5491234567890@c.us')

        expect(mockConversationDeleteMany).toHaveBeenCalledTimes(1)
        expect(mockConversationDeleteMany).toHaveBeenCalledWith({
          where: {
            chat: '5491234567890@c.us',
          },
        })
      })

      it('debería llamar a deleteMany con el chat correcto', async () => {
        mockConversationDeleteMany.mockResolvedValue({ count: 3 })

        await clearConversation('5499876543210@c.us')

        expect(mockConversationDeleteMany).toHaveBeenCalledWith({
          where: {
            chat: '5499876543210@c.us',
          },
        })
      })

      it('debería ejecutarse sin errores cuando no hay conversaciones', async () => {
        mockConversationDeleteMany.mockResolvedValue({ count: 0 })

        await expect(clearConversation('5491234567890@c.us')).resolves.not.toThrow()
      })

      it('debería completarse exitosamente', async () => {
        mockConversationDeleteMany.mockResolvedValue({ count: 10 })

        const result = await clearConversation('5491234567890@c.us')

        expect(result).toBeUndefined()
      })

      it('debería manejar identificadores de chat largos', async () => {
        const longChatId = '549'.repeat(100) + '@c.us'
        mockConversationDeleteMany.mockResolvedValue({ count: 1 })

        await clearConversation(longChatId)

        expect(mockConversationDeleteMany).toHaveBeenCalledWith({
          where: {
            chat: longChatId,
          },
        })
      })

      it('debería manejar identificadores de chat con caracteres especiales', async () => {
        const specialChatId = '549-1234-5678@g.us'
        mockConversationDeleteMany.mockResolvedValue({ count: 2 })

        await clearConversation(specialChatId)

        expect(mockConversationDeleteMany).toHaveBeenCalledWith({
          where: {
            chat: specialChatId,
          },
        })
      })
    })

    describe('Casos de error', () => {
      it('debería propagar el error si la eliminación falla', async () => {
        mockConversationDeleteMany.mockRejectedValue(new Error('Error de base de datos'))

        await expect(clearConversation('5491234567890@c.us')).rejects.toThrow('Error de base de datos')
      })

      it('debería intentar eliminar aunque falle', async () => {
        mockConversationDeleteMany.mockRejectedValue(new Error('Error de conexión'))

        try {
          await clearConversation('5491234567890@c.us')
        } catch {
          // Esperamos el error
        }

        expect(mockConversationDeleteMany).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Integración entre funciones', () => {
    it('debería poder registrar y luego obtener conversaciones', async () => {
      const mockConversation = {
        id: 1,
        chat: '5491234567890@c.us',
        userName: 'Juan',
        user_message: 'Hola',
        bot_response: 'Hola Juan',
        createdAt: new Date('2026-01-30T10:00:00.000Z'),
      }

      mockConversationCreate.mockResolvedValue(mockConversation)
      mockConversationFindMany.mockResolvedValue([mockConversation])

      await registerConversation({
        chat: '5491234567890@c.us',
        userName: 'Juan',
        user_message: 'Hola',
        bot_response: 'Hola Juan',
      })

      const result = await getChatConversation('5491234567890@c.us', 'Juan', '¿Cómo estás?')

      expect(result).toContain('Juan: Hola')
      expect(result).toContain('Juan: ¿Cómo estás?')
    })

    it('debería poder registrar, obtener y luego limpiar conversaciones', async () => {
      const mockConversation = {
        id: 1,
        chat: '5491234567890@c.us',
        userName: 'María',
        user_message: 'Test',
        bot_response: 'Test response',
        createdAt: new Date('2026-01-30T10:00:00.000Z'),
      }

      mockConversationCreate.mockResolvedValue(mockConversation)
      mockConversationFindMany.mockResolvedValue([mockConversation])
      mockConversationDeleteMany.mockResolvedValue({ count: 1 })

      await registerConversation({
        chat: '5491234567890@c.us',
        userName: 'María',
        user_message: 'Test',
        bot_response: 'Test response',
      })

      await getChatConversation('5491234567890@c.us', 'María', 'Nuevo')
      await clearConversation('5491234567890@c.us')

      expect(mockConversationCreate).toHaveBeenCalledTimes(1)
      expect(mockConversationFindMany).toHaveBeenCalledTimes(1)
      expect(mockConversationDeleteMany).toHaveBeenCalledTimes(1)
    })

    it('debería manejar flujo completo con múltiples operaciones', async () => {
      mockConversationCreate.mockResolvedValue({
        id: 1,
        chat: '5491234567890@c.us',
        userName: 'Test',
        user_message: 'Msg1',
        bot_response: 'Res1',
        createdAt: new Date(),
      })
      mockConversationFindMany.mockResolvedValue([])
      mockConversationDeleteMany.mockResolvedValue({ count: 1 })

      await registerConversation({
        chat: '5491234567890@c.us',
        userName: 'Test',
        user_message: 'Msg1',
        bot_response: 'Res1',
      })
      await getChatConversation('5491234567890@c.us', 'Test', 'Msg2')
      await clearConversation('5491234567890@c.us')

      expect(mockConversationCreate).toHaveBeenCalled()
      expect(mockConversationFindMany).toHaveBeenCalled()
      expect(mockConversationDeleteMany).toHaveBeenCalled()
    })
  })
})
