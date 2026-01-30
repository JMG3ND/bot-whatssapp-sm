import { describe, expect, it, vi } from 'vitest'
import type { Chat, Message } from 'whatsapp-web.js'
import { readChatName } from '../../../src/app/utils/readChatName'

describe('readChatName', () => {
  describe('Casos exitosos', () => {
    it('debería retornar el nombre del chat cuando existe', async () => {
      const mockChat = {
        name: 'Grupo de Trabajo',
      } as unknown as Chat

      const mockMessage = {
        getChat: vi.fn().mockResolvedValue(mockChat),
      } as unknown as Message

      const result = await readChatName(mockMessage)
      expect(result).toBe('Grupo de Trabajo')
    })

    it('debería retornar el nombre del chat para un chat individual', async () => {
      const mockChat = {
        name: 'Juan Pérez',
      } as unknown as Chat

      const mockMessage = {
        getChat: vi.fn().mockResolvedValue(mockChat),
      } as unknown as Message

      const result = await readChatName(mockMessage)
      expect(result).toBe('Juan Pérez')
    })

    it('debería retornar el nombre del chat para un grupo', async () => {
      const mockChat = {
        name: 'Amigos del Trabajo',
      } as unknown as Chat

      const mockMessage = {
        getChat: vi.fn().mockResolvedValue(mockChat),
      } as unknown as Message

      const result = await readChatName(mockMessage)
      expect(result).toBe('Amigos del Trabajo')
    })

    it('debería retornar el nombre del chat con caracteres especiales', async () => {
      const mockChat = {
        name: 'Grupo @#$% *&^',
      } as unknown as Chat

      const mockMessage = {
        getChat: vi.fn().mockResolvedValue(mockChat),
      } as unknown as Message

      const result = await readChatName(mockMessage)
      expect(result).toBe('Grupo @#$% *&^')
    })

    it('debería retornar el nombre del chat con emojis', async () => {
      const mockChat = {
        name: '🎉 Fiesta 🎊',
      } as unknown as Chat

      const mockMessage = {
        getChat: vi.fn().mockResolvedValue(mockChat),
      } as unknown as Message

      const result = await readChatName(mockMessage)
      expect(result).toBe('🎉 Fiesta 🎊')
    })

    it('debería retornar el nombre del chat con números', async () => {
      const mockChat = {
        name: 'Grupo 123',
      } as unknown as Chat

      const mockMessage = {
        getChat: vi.fn().mockResolvedValue(mockChat),
      } as unknown as Message

      const result = await readChatName(mockMessage)
      expect(result).toBe('Grupo 123')
    })

    it('debería retornar el nombre del chat con espacios múltiples', async () => {
      const mockChat = {
        name: 'Grupo   con   espacios',
      } as unknown as Chat

      const mockMessage = {
        getChat: vi.fn().mockResolvedValue(mockChat),
      } as unknown as Message

      const result = await readChatName(mockMessage)
      expect(result).toBe('Grupo   con   espacios')
    })

    it('debería retornar el nombre del chat con saltos de línea', async () => {
      const mockChat = {
        name: 'Grupo\ncon\nsaltos',
      } as unknown as Chat

      const mockMessage = {
        getChat: vi.fn().mockResolvedValue(mockChat),
      } as unknown as Message

      const result = await readChatName(mockMessage)
      expect(result).toBe('Grupo\ncon\nsaltos')
    })

    it('debería retornar el nombre del chat muy largo', async () => {
      const longName = 'Este es un nombre de chat extremadamente largo que podría existir en WhatsApp aunque sea poco común'
      const mockChat = {
        name: longName,
      } as unknown as Chat

      const mockMessage = {
        getChat: vi.fn().mockResolvedValue(mockChat),
      } as unknown as Message

      const result = await readChatName(mockMessage)
      expect(result).toBe(longName)
    })
  })

  describe('Casos especiales', () => {
    it('debería retornar string vacío cuando el nombre del chat está vacío', async () => {
      const mockChat = {
        name: '',
      } as unknown as Chat

      const mockMessage = {
        getChat: vi.fn().mockResolvedValue(mockChat),
      } as unknown as Message

      const result = await readChatName(mockMessage)
      expect(result).toBe('')
    })

    it('debería retornar undefined cuando el nombre del chat es undefined', async () => {
      const mockChat = {
        name: undefined,
      } as unknown as Chat

      const mockMessage = {
        getChat: vi.fn().mockResolvedValue(mockChat),
      } as unknown as Message

      const result = await readChatName(mockMessage)
      expect(result).toBeUndefined()
    })

    it('debería retornar el nombre del chat con solo espacios', async () => {
      const mockChat = {
        name: '   ',
      } as unknown as Chat

      const mockMessage = {
        getChat: vi.fn().mockResolvedValue(mockChat),
      } as unknown as Message

      const result = await readChatName(mockMessage)
      expect(result).toBe('   ')
    })

    it('debería retornar el nombre del chat con caracteres Unicode', async () => {
      const mockChat = {
        name: 'Grupo 你好 مرحبا',
      } as unknown as Chat

      const mockMessage = {
        getChat: vi.fn().mockResolvedValue(mockChat),
      } as unknown as Message

      const result = await readChatName(mockMessage)
      expect(result).toBe('Grupo 你好 مرحبا')
    })

    it('debería llamar a getChat() del mensaje', async () => {
      const mockChat = {
        name: 'Test Chat',
      } as unknown as Chat

      const getChatMock = vi.fn().mockResolvedValue(mockChat)
      const mockMessage = {
        getChat: getChatMock,
      } as unknown as Message

      await readChatName(mockMessage)
      expect(getChatMock).toHaveBeenCalledTimes(1)
    })
  })
})
