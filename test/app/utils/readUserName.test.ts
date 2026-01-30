import { describe, it, expect, vi } from 'vitest'
import { readUserName } from '../../../src/app/utils/readUserName'
import type { Message, Chat, Contact } from 'whatsapp-web.js'

describe('readUserName', () => {
  describe('debería leer el nombre de usuario en grupos', () => {
    it('debería retornar pushname del contacto cuando está disponible', async () => {
      const mockContact = {
        pushname: 'Juan Pérez',
        number: '1234567890',
      } as Contact

      const mockChat = {
        isGroup: true,
      } as Chat

      const mockMessage = {
        getChat: vi.fn().mockResolvedValue(mockChat),
        getContact: vi.fn().mockResolvedValue(mockContact),
      } as unknown as Message

      const result = await readUserName(mockMessage)
      expect(result).toBe('Juan Pérez')
      expect(mockMessage.getChat).toHaveBeenCalledOnce()
      expect(mockMessage.getContact).toHaveBeenCalledOnce()
    })

    it('debería retornar number cuando pushname no está disponible', async () => {
      const mockContact = {
        pushname: undefined,
        number: '1234567890',
      } as unknown as Contact

      const mockChat = {
        isGroup: true,
      } as Chat

      const mockMessage = {
        getChat: vi.fn().mockResolvedValue(mockChat),
        getContact: vi.fn().mockResolvedValue(mockContact),
      } as unknown as Message

      const result = await readUserName(mockMessage)
      expect(result).toBe('1234567890')
    })

    it('debería retornar number cuando pushname es null', async () => {
      const mockContact = {
        pushname: null,
        number: '9876543210',
      } as unknown as Contact

      const mockChat = {
        isGroup: true,
      } as Chat

      const mockMessage = {
        getChat: vi.fn().mockResolvedValue(mockChat),
        getContact: vi.fn().mockResolvedValue(mockContact),
      } as unknown as Message

      const result = await readUserName(mockMessage)
      expect(result).toBe('9876543210')
    })

    it('debería retornar number cuando pushname es string vacío', async () => {
      const mockContact = {
        pushname: '',
        number: '5555555555',
      } as Contact

      const mockChat = {
        isGroup: true,
      } as Chat

      const mockMessage = {
        getChat: vi.fn().mockResolvedValue(mockChat),
        getContact: vi.fn().mockResolvedValue(mockContact),
      } as unknown as Message

      const result = await readUserName(mockMessage)
      expect(result).toBe('5555555555')
    })

    it('debería manejar nombres con caracteres especiales', async () => {
      const mockContact = {
        pushname: 'María José Ñoño 😊',
        number: '1111111111',
      } as Contact

      const mockChat = {
        isGroup: true,
      } as Chat

      const mockMessage = {
        getChat: vi.fn().mockResolvedValue(mockChat),
        getContact: vi.fn().mockResolvedValue(mockContact),
      } as unknown as Message

      const result = await readUserName(mockMessage)
      expect(result).toBe('María José Ñoño 😊')
    })

    it('debería manejar números con formato internacional', async () => {
      const mockContact = {
        pushname: undefined,
        number: '+1-555-123-4567',
      } as unknown as Contact

      const mockChat = {
        isGroup: true,
      } as Chat

      const mockMessage = {
        getChat: vi.fn().mockResolvedValue(mockChat),
        getContact: vi.fn().mockResolvedValue(mockContact),
      } as unknown as Message

      const result = await readUserName(mockMessage)
      expect(result).toBe('+1-555-123-4567')
    })
  })

  describe('debería leer el nombre de usuario en chats individuales', () => {
    it('debería retornar el nombre del chat cuando está disponible', async () => {
      const mockChat = {
        isGroup: false,
        name: 'Pedro García',
        id: {
          user: '1234567890',
        },
      } as Chat

      const mockMessage = {
        getChat: vi.fn().mockResolvedValue(mockChat),
      } as unknown as Message

      const result = await readUserName(mockMessage)
      expect(result).toBe('Pedro García')
      expect(mockMessage.getChat).toHaveBeenCalledOnce()
    })

    it('debería retornar user id cuando el nombre del chat no está disponible', async () => {
      const mockChat = {
        isGroup: false,
        name: undefined,
        id: {
          user: '9876543210',
        },
      } as unknown as Chat

      const mockMessage = {
        getChat: vi.fn().mockResolvedValue(mockChat),
      } as unknown as Message

      const result = await readUserName(mockMessage)
      expect(result).toBe('9876543210')
    })

    it('debería retornar user id cuando el nombre del chat es null', async () => {
      const mockChat = {
        isGroup: false,
        name: null,
        id: {
          user: '5555555555',
        },
      } as unknown as Chat

      const mockMessage = {
        getChat: vi.fn().mockResolvedValue(mockChat),
      } as unknown as Message

      const result = await readUserName(mockMessage)
      expect(result).toBe('5555555555')
    })

    it('debería retornar user id cuando el nombre del chat es string vacío', async () => {
      const mockChat = {
        isGroup: false,
        name: '',
        id: {
          user: '7777777777',
        },
      } as Chat

      const mockMessage = {
        getChat: vi.fn().mockResolvedValue(mockChat),
      } as unknown as Message

      const result = await readUserName(mockMessage)
      expect(result).toBe('7777777777')
    })

    it('debería manejar nombres de chat con emojis', async () => {
      const mockChat = {
        isGroup: false,
        name: 'Cliente VIP 🌟',
        id: {
          user: '1234567890',
        },
      } as Chat

      const mockMessage = {
        getChat: vi.fn().mockResolvedValue(mockChat),
      } as unknown as Message

      const result = await readUserName(mockMessage)
      expect(result).toBe('Cliente VIP 🌟')
    })

    it('debería manejar nombres de chat con caracteres especiales', async () => {
      const mockChat = {
        isGroup: false,
        name: 'Distribuidora "La Económica"',
        id: {
          user: '1111111111',
        },
      } as Chat

      const mockMessage = {
        getChat: vi.fn().mockResolvedValue(mockChat),
      } as unknown as Message

      const result = await readUserName(mockMessage)
      expect(result).toBe('Distribuidora "La Económica"')
    })

    it('debería manejar nombres de chat largos', async () => {
      const longName = 'Este es un nombre muy largo que podría ser usado como nombre de contacto en WhatsApp'
      const mockChat = {
        isGroup: false,
        name: longName,
        id: {
          user: '2222222222',
        },
      } as Chat

      const mockMessage = {
        getChat: vi.fn().mockResolvedValue(mockChat),
      } as unknown as Message

      const result = await readUserName(mockMessage)
      expect(result).toBe(longName)
    })
  })

  describe('debería manejar diferentes formatos de user id', () => {
    it('debería manejar user id numérico simple', async () => {
      const mockChat = {
        isGroup: false,
        name: undefined,
        id: {
          user: '1234567890',
        },
      } as unknown as Chat

      const mockMessage = {
        getChat: vi.fn().mockResolvedValue(mockChat),
      } as unknown as Message

      const result = await readUserName(mockMessage)
      expect(result).toBe('1234567890')
    })

    it('debería manejar user id con código de país', async () => {
      const mockChat = {
        isGroup: false,
        name: undefined,
        id: {
          user: '521234567890',
        },
      } as unknown as Chat

      const mockMessage = {
        getChat: vi.fn().mockResolvedValue(mockChat),
      } as unknown as Message

      const result = await readUserName(mockMessage)
      expect(result).toBe('521234567890')
    })
  })

  describe('debería diferenciar correctamente entre grupos y chats individuales', () => {
    it('no debería llamar getContact en chats individuales', async () => {
      const mockChat = {
        isGroup: false,
        name: 'Usuario Individual',
        id: {
          user: '1234567890',
        },
      } as Chat

      const mockGetContact = vi.fn()
      const mockMessage = {
        getChat: vi.fn().mockResolvedValue(mockChat),
        getContact: mockGetContact,
      } as unknown as Message

      await readUserName(mockMessage)
      expect(mockGetContact).not.toHaveBeenCalled()
    })

    it('debería llamar getContact solo en grupos', async () => {
      const mockContact = {
        pushname: 'Usuario de Grupo',
        number: '1234567890',
      } as Contact

      const mockChat = {
        isGroup: true,
      } as Chat

      const mockGetContact = vi.fn().mockResolvedValue(mockContact)
      const mockMessage = {
        getChat: vi.fn().mockResolvedValue(mockChat),
        getContact: mockGetContact,
      } as unknown as Message

      await readUserName(mockMessage)
      expect(mockGetContact).toHaveBeenCalledOnce()
    })
  })
})
