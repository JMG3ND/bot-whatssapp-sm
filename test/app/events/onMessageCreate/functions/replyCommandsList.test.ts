import { describe, expect, it, vi } from 'vitest'
import type { Message } from 'whatsapp-web.js'
import { replyCommandsList } from '../../../../../src/app/events/onMessageCreate/functions/replyCommandsList'

// Mock de getCommandsList
vi.mock('../../../../../src/app/events/onMessageCreate/commands/getCommandsList', () => ({
  getCommandsList: vi.fn(() =>
    '/help: Muestra la lista de comandos disponibles\n\n' +
    '/ai: Interactúa con la inteligencia artificial\n\n' +
    '/trazability: Envía los reportes de trazabilidad de estación, ejemplo:\n/trazability bodega\n\n' +
    '/clear-memory: Limpia la memoria de la conversación actual',
  ),
}))

describe('replyCommandsList', () => {
  describe('Casos exitosos', () => {
    it('debería responder con la lista de comandos disponibles', async () => {
      const replyMock = vi.fn().mockResolvedValue(undefined)
      const mockMessage = {
        reply: replyMock,
      } as unknown as Message

      await replyCommandsList(mockMessage)

      expect(replyMock).toHaveBeenCalledTimes(1)
      expect(replyMock).toHaveBeenCalledWith(
        'Lista de comandos disponibles:\n\n' +
        '/help: Muestra la lista de comandos disponibles\n\n' +
        '/ai: Interactúa con la inteligencia artificial\n\n' +
        '/trazability: Envía los reportes de trazabilidad de estación, ejemplo:\n/trazability bodega\n\n' +
        '/clear-memory: Limpia la memoria de la conversación actual',
      )
    })

    it('debería llamar al método reply del mensaje', async () => {
      const replyMock = vi.fn().mockResolvedValue(undefined)
      const mockMessage = {
        reply: replyMock,
      } as unknown as Message

      await replyCommandsList(mockMessage)

      expect(replyMock).toHaveBeenCalled()
    })

    it('debería incluir el prefijo "Lista de comandos disponibles:" en la respuesta', async () => {
      const replyMock = vi.fn().mockResolvedValue(undefined)
      const mockMessage = {
        reply: replyMock,
      } as unknown as Message

      await replyCommandsList(mockMessage)

      const callArg = replyMock.mock.calls[0][0]
      expect(callArg).toContain('Lista de comandos disponibles:')
    })

    it('debería incluir el comando /help en la respuesta', async () => {
      const replyMock = vi.fn().mockResolvedValue(undefined)
      const mockMessage = {
        reply: replyMock,
      } as unknown as Message

      await replyCommandsList(mockMessage)

      const callArg = replyMock.mock.calls[0][0]
      expect(callArg).toContain('/help')
      expect(callArg).toContain('Muestra la lista de comandos disponibles')
    })

    it('debería incluir el comando /ai en la respuesta', async () => {
      const replyMock = vi.fn().mockResolvedValue(undefined)
      const mockMessage = {
        reply: replyMock,
      } as unknown as Message

      await replyCommandsList(mockMessage)

      const callArg = replyMock.mock.calls[0][0]
      expect(callArg).toContain('/ai')
      expect(callArg).toContain('Interactúa con la inteligencia artificial')
    })

    it('debería incluir el comando /trazability en la respuesta', async () => {
      const replyMock = vi.fn().mockResolvedValue(undefined)
      const mockMessage = {
        reply: replyMock,
      } as unknown as Message

      await replyCommandsList(mockMessage)

      const callArg = replyMock.mock.calls[0][0]
      expect(callArg).toContain('/trazability')
      expect(callArg).toContain('Envía los reportes de trazabilidad de estación')
    })

    it('debería incluir el comando /clear-memory en la respuesta', async () => {
      const replyMock = vi.fn().mockResolvedValue(undefined)
      const mockMessage = {
        reply: replyMock,
      } as unknown as Message

      await replyCommandsList(mockMessage)

      const callArg = replyMock.mock.calls[0][0]
      expect(callArg).toContain('/clear-memory')
      expect(callArg).toContain('Limpia la memoria de la conversación actual')
    })

    it('debería incluir separadores de doble salto de línea entre comandos', async () => {
      const replyMock = vi.fn().mockResolvedValue(undefined)
      const mockMessage = {
        reply: replyMock,
      } as unknown as Message

      await replyCommandsList(mockMessage)

      const callArg = replyMock.mock.calls[0][0]
      expect(callArg).toContain('\n\n')
    })

    it('debería completar la ejecución sin errores', async () => {
      const replyMock = vi.fn().mockResolvedValue(undefined)
      const mockMessage = {
        reply: replyMock,
      } as unknown as Message

      await expect(replyCommandsList(mockMessage)).resolves.not.toThrow()
    })

    it('debería esperar a que el reply se complete', async () => {
      let replyCompleted = false
      const replyMock = vi.fn().mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 10))
        replyCompleted = true
      })
      const mockMessage = {
        reply: replyMock,
      } as unknown as Message

      await replyCommandsList(mockMessage)

      expect(replyCompleted).toBe(true)
    })
  })

  describe('Casos de error', () => {
    it('debería propagar el error si reply falla', async () => {
      const replyMock = vi.fn().mockRejectedValue(new Error('Error al enviar mensaje'))
      const mockMessage = {
        reply: replyMock,
      } as unknown as Message

      await expect(replyCommandsList(mockMessage)).rejects.toThrow('Error al enviar mensaje')
    })

    it('debería intentar enviar el mensaje incluso si reply es rechazado', async () => {
      const replyMock = vi.fn().mockRejectedValue(new Error('Error de red'))
      const mockMessage = {
        reply: replyMock,
      } as unknown as Message

      try {
        await replyCommandsList(mockMessage)
      } catch {
        // Esperamos el error
      }

      expect(replyMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('Integración con getCommandsList', () => {
    it('debería usar getCommandsList para obtener los comandos', async () => {
      const replyMock = vi.fn().mockResolvedValue(undefined)
      const mockMessage = {
        reply: replyMock,
      } as unknown as Message

      await replyCommandsList(mockMessage)

      const callArg = replyMock.mock.calls[0][0]
      // Verifica que la estructura coincida con lo que getCommandsList devuelve
      expect(callArg).toMatch(/\/[a-z-]+:.+/i)
    })

    it('debería formatear la respuesta con el texto correcto', async () => {
      const replyMock = vi.fn().mockResolvedValue(undefined)
      const mockMessage = {
        reply: replyMock,
      } as unknown as Message

      await replyCommandsList(mockMessage)

      const callArg = replyMock.mock.calls[0][0]
      expect(callArg).toMatch(/^Lista de comandos disponibles:\n\n/)
    })
  })
})
