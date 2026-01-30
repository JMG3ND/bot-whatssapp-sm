import { describe, it, expect } from 'vitest'
import { addMessageToConversation } from '../../../../src/modules/agent/utils/addMessageToConversation'

describe('addMessageToConversation', () => {
  describe('debería agregar un mensaje a una conversación existente', () => {
    it('debería agregar un mensaje simple a una conversación', () => {
      const conversation = 'Usuario: Hola\nBot: Hola, ¿cómo estás?'
      const messageToAdd = 'Usuario: Necesito ayuda'
      const result = addMessageToConversation(conversation, messageToAdd)

      expect(result).toBe('Usuario: Hola\nBot: Hola, ¿cómo estás? \nUsuario: Necesito ayuda')
    })

    it('debería agregar un mensaje multilinea a una conversación', () => {
      const conversation = 'Primera parte'
      const messageToAdd = 'Segunda parte\nTercera parte'
      const result = addMessageToConversation(conversation, messageToAdd)

      expect(result).toBe('Primera parte \nSegunda parte\nTercera parte')
    })

    it('debería agregar un mensaje a una conversación vacía', () => {
      const conversation = ''
      const messageToAdd = 'Primer mensaje'
      const result = addMessageToConversation(conversation, messageToAdd)

      expect(result).toBe(' \nPrimer mensaje')
    })

    it('debería manejar conversaciones con múltiples intercambios', () => {
      const conversation = 'Usuario: Hola\nBot: Hola\nUsuario: ¿Cómo estás?\nBot: Bien, gracias'
      const messageToAdd = 'Usuario: Me alegro'
      const result = addMessageToConversation(conversation, messageToAdd)

      expect(result).toBe('Usuario: Hola\nBot: Hola\nUsuario: ¿Cómo estás?\nBot: Bien, gracias \nUsuario: Me alegro')
    })
  })

  describe('debería manejar casos especiales', () => {
    it('debería retornar solo la conversación original cuando el mensaje está vacío', () => {
      const conversation = 'Usuario: Hola\nBot: Hola'
      const messageToAdd = ''
      const result = addMessageToConversation(conversation, messageToAdd)

      expect(result).toBe('Usuario: Hola\nBot: Hola ')
    })

    it('debería manejar conversación y mensaje vacíos', () => {
      const conversation = ''
      const messageToAdd = ''
      const result = addMessageToConversation(conversation, messageToAdd)

      expect(result).toBe(' ')
    })

    it('debería manejar mensajes con caracteres especiales', () => {
      const conversation = 'Conversación inicial'
      const messageToAdd = '¡Hola! ¿Qué tal? #test @usuario'
      const result = addMessageToConversation(conversation, messageToAdd)

      expect(result).toBe('Conversación inicial \n¡Hola! ¿Qué tal? #test @usuario')
    })

    it('debería manejar mensajes con emojis', () => {
      const conversation = 'Chat normal'
      const messageToAdd = '😊 ¡Genial! 🎉'
      const result = addMessageToConversation(conversation, messageToAdd)

      expect(result).toBe('Chat normal \n😊 ¡Genial! 🎉')
    })

    it('debería manejar mensajes con espacios múltiples', () => {
      const conversation = 'Texto    con    espacios'
      const messageToAdd = 'Más    espacios    aquí'
      const result = addMessageToConversation(conversation, messageToAdd)

      expect(result).toBe('Texto    con    espacios \nMás    espacios    aquí')
    })

    it('debería manejar mensajes con tabulaciones', () => {
      const conversation = 'Conversación\tcon\ttabs'
      const messageToAdd = 'Mensaje\tcon\ttabs'
      const result = addMessageToConversation(conversation, messageToAdd)

      expect(result).toBe('Conversación\tcon\ttabs \nMensaje\tcon\ttabs')
    })
  })

  describe('debería preservar el formato original', () => {
    it('debería preservar saltos de línea en la conversación original', () => {
      const conversation = 'Línea 1\nLínea 2\nLínea 3'
      const messageToAdd = 'Nueva línea'
      const result = addMessageToConversation(conversation, messageToAdd)

      expect(result).toBe('Línea 1\nLínea 2\nLínea 3 \nNueva línea')
    })

    it('debería agregar exactamente un salto de línea antes del nuevo mensaje', () => {
      const conversation = 'Conversación'
      const messageToAdd = 'Nuevo'
      const result = addMessageToConversation(conversation, messageToAdd)

      const parts = result.split('\n')
      expect(parts).toHaveLength(2)
      expect(parts[0]).toBe('Conversación ')
      expect(parts[1]).toBe('Nuevo')
    })

    it('debería manejar conversaciones largas', () => {
      const conversation = Array(10).fill('Usuario: Mensaje').join('\n')
      const messageToAdd = 'Bot: Respuesta final'
      const result = addMessageToConversation(conversation, messageToAdd)

      expect(result).toContain('Usuario: Mensaje')
      expect(result).toContain('\nBot: Respuesta final')
      expect(result.endsWith('Bot: Respuesta final')).toBe(true)
    })
  })
})
