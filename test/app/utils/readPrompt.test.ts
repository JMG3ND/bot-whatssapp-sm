import { describe, it, expect } from 'vitest'
import { readPrompt } from '../../../src/app/utils/readPrompt'
import type { Message } from 'whatsapp-web.js'

describe('readPrompt', () => {
  describe('debería extraer el prompt correctamente', () => {
    it('debería extraer el prompt cuando el comando es /ai', () => {
      const message = {
        body: '/ai ¿Cuál es el stock de pollo?',
      } as Message

      const result = readPrompt(message)
      expect(result).toBe('¿Cuál es el stock de pollo?')
    })

    it('debería extraer el prompt con /AI en mayúsculas', () => {
      const message = {
        body: '/AI Necesito información sobre trazabilidad',
      } as Message

      const result = readPrompt(message)
      expect(result).toBe('Necesito información sobre trazabilidad')
    })

    it('debería extraer el prompt con /Ai en case mixto', () => {
      const message = {
        body: '/Ai ¿Qué productos hay disponibles?',
      } as Message

      const result = readPrompt(message)
      expect(result).toBe('¿Qué productos hay disponibles?')
    })

    it('debería manejar múltiples espacios después del comando', () => {
      const message = {
        body: '/ai    Dame el reporte de hoy',
      } as Message

      const result = readPrompt(message)
      expect(result).toBe('Dame el reporte de hoy')
    })

    it('debería extraer prompt largo', () => {
      const longPrompt = 'Necesito que me des un reporte detallado de todos los productos en el inventario, específicamente los que están en el FREEZER y en las bodegas del #01 al #30, con información de peso y cantidad de cajas'
      const message = {
        body: `/ai ${longPrompt}`,
      } as Message

      const result = readPrompt(message)
      expect(result).toBe(longPrompt)
    })

    it('debería manejar prompts con saltos de línea', () => {
      const message = {
        body: '/ai Dame el stock de:\n- POLLO\n- CARNE\n- PESCADO',
      } as Message

      const result = readPrompt(message)
      expect(result).toBe('Dame el stock de:\n- POLLO\n- CARNE\n- PESCADO')
    })

    it('debería manejar prompts con caracteres especiales', () => {
      const message = {
        body: '/ai ¿Cuánto stock hay? #urgente @admin',
      } as Message

      const result = readPrompt(message)
      expect(result).toBe('¿Cuánto stock hay? #urgente @admin')
    })

    it('debería manejar prompts con emojis', () => {
      const message = {
        body: '/ai Dame el reporte 📊 del inventario 🏭',
      } as Message

      const result = readPrompt(message)
      expect(result).toBe('Dame el reporte 📊 del inventario 🏭')
    })

    it('debería manejar prompts con números', () => {
      const message = {
        body: '/ai ¿Cuántas cajas hay en bodega #01 y #02?',
      } as Message

      const result = readPrompt(message)
      expect(result).toBe('¿Cuántas cajas hay en bodega #01 y #02?')
    })

    it('debería manejar prompts con comillas', () => {
      const message = {
        body: '/ai Busca el producto "POLLO ENTERO"',
      } as Message

      const result = readPrompt(message)
      expect(result).toBe('Busca el producto "POLLO ENTERO"')
    })
  })

  describe('debería lanzar error cuando el prompt está vacío', () => {
    it('debería lanzar error cuando solo está el comando sin prompt', () => {
      const message = {
        body: '/ai',
      } as Message

      expect(() => readPrompt(message)).toThrow('Prompt is empty after removing command.')
    })

    it('debería lanzar error cuando el comando tiene solo espacios', () => {
      const message = {
        body: '/ai   ',
      } as Message

      expect(() => readPrompt(message)).toThrow('Prompt is empty after removing command.')
    })

    it('debería lanzar error cuando el comando tiene solo saltos de línea', () => {
      const message = {
        body: '/ai\n\n\n',
      } as Message

      expect(() => readPrompt(message)).toThrow('Prompt is empty after removing command.')
    })

    it('debería lanzar error cuando el comando tiene solo tabs', () => {
      const message = {
        body: '/ai\t\t',
      } as Message

      expect(() => readPrompt(message)).toThrow('Prompt is empty after removing command.')
    })
  })

  describe('debería manejar edge cases', () => {
    it('debería extraer prompt que empieza con slash', () => {
      const message = {
        body: '/ai /trazability no es un comando aquí',
      } as Message

      const result = readPrompt(message)
      expect(result).toBe('/trazability no es un comando aquí')
    })

    it('debería manejar prompt con el comando en el medio', () => {
      const message = {
        body: '/ai El comando /ai es útil',
      } as Message

      const result = readPrompt(message)
      expect(result).toBe('El comando /ai es útil')
    })

    it('debería preservar espacios múltiples dentro del prompt', () => {
      const message = {
        body: '/ai Dame    información    del    stock',
      } as Message

      const result = readPrompt(message)
      expect(result).toBe('Dame    información    del    stock')
    })

    it('debería manejar prompt que parece un comando pero no lo es', () => {
      const message = {
        body: '/ai /help debería mostrar ayuda',
      } as Message

      const result = readPrompt(message)
      expect(result).toBe('/help debería mostrar ayuda')
    })

    it('debería extraer prompt con URL', () => {
      const message = {
        body: '/ai Revisa este link: https://example.com/api/stock',
      } as Message

      const result = readPrompt(message)
      expect(result).toBe('Revisa este link: https://example.com/api/stock')
    })

    it('debería manejar prompt con código JSON', () => {
      const message = {
        body: '/ai Busca con estos parámetros: {"storage": "FREEZER", "limit": 10}',
      } as Message

      const result = readPrompt(message)
      expect(result).toBe('Busca con estos parámetros: {"storage": "FREEZER", "limit": 10}')
    })
  })

  describe('debería ser case insensitive con el comando', () => {
    it('debería funcionar con /aI', () => {
      const message = {
        body: '/aI test prompt',
      } as Message

      const result = readPrompt(message)
      expect(result).toBe('test prompt')
    })

    it('debería funcionar con /AI', () => {
      const message = {
        body: '/AI test prompt',
      } as Message

      const result = readPrompt(message)
      expect(result).toBe('test prompt')
    })

    it('debería funcionar con /Ai', () => {
      const message = {
        body: '/Ai test prompt',
      } as Message

      const result = readPrompt(message)
      expect(result).toBe('test prompt')
    })
  })
})
