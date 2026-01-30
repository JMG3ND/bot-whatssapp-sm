import { describe, it, expect } from 'vitest'
import { readCommand } from '../../../../../src/app/events/onMessageCreate/commands/readCommand'
import { Message } from 'whatsapp-web.js'

describe('readCommand', () => {
  it('debe detectar el comando /help y removerlo del mensaje', () => {
    const message = { body: '/help mostrar comandos' } as Message
    const result = readCommand(message)

    expect(result).toBe('help')
    expect(message.body).toBe('mostrar comandos')
  })

  it('debe detectar el comando /ai y removerlo del mensaje', () => {
    const message = { body: '/ai ¿Qué es TypeScript?' } as Message
    const result = readCommand(message)

    expect(result).toBe('ai')
    expect(message.body).toBe('¿Qué es TypeScript?')
  })

  it('debe detectar el comando /trazability y removerlo del mensaje', () => {
    const message = { body: '/trazability bodega' } as Message
    const result = readCommand(message)

    expect(result).toBe('trazability')
    expect(message.body).toBe('bodega')
  })

  it('debe detectar el comando /clear-memory y removerlo del mensaje', () => {
    const message = { body: '/clear-memory por favor' } as Message
    const result = readCommand(message)

    expect(result).toBe('clear-memory')
    expect(message.body).toBe('por favor')
  })

  it('debe ser case-insensitive al detectar comandos', () => {
    const message1 = { body: '/HELP ayuda' } as Message
    const result1 = readCommand(message1)

    expect(result1).toBe('help')
    expect(message1.body).toBe('ayuda')

    const message2 = { body: '/Ai pregunta' } as Message
    const result2 = readCommand(message2)

    expect(result2).toBe('ai')
    expect(message2.body).toBe('pregunta')
  })

  it('debe retornar undefined si no se detecta ningún comando', () => {
    const message = { body: 'hola, ¿cómo estás?' } as Message
    const result = readCommand(message)

    expect(result).toBeUndefined()
    expect(message.body).toBe('hola, ¿cómo estás?')
  })

  it('debe retornar undefined si el mensaje solo contiene el comando sin contenido adicional', () => {
    const message = { body: '/help' } as Message
    const result = readCommand(message)

    expect(result).toBeUndefined()
    expect(message.body).toBe('')
  })

  it('debe manejar espacios en blanco adicionales después del comando', () => {
    const message = { body: '/ai    pregunta con espacios' } as Message
    const result = readCommand(message)

    expect(result).toBe('ai')
    expect(message.body).toBe('pregunta con espacios')
  })

  it('debe detectar solo comandos al inicio del mensaje', () => {
    const message = { body: 'este mensaje tiene /help en el medio' } as Message
    const result = readCommand(message)

    expect(result).toBeUndefined()
    expect(message.body).toBe('este mensaje tiene /help en el medio')
  })

  it('debe retornar undefined cuando el mensaje después de remover el comando está vacío (solo espacios)', () => {
    const message = { body: '/clear-memory   ' } as Message
    const result = readCommand(message)

    expect(result).toBeUndefined()
    expect(message.body).toBe('')
  })

  it('debe detectar y remover comandos con caracteres especiales en el contenido', () => {
    const message = { body: '/trazability bodega@123 #test' } as Message
    const result = readCommand(message)

    expect(result).toBe('trazability')
    expect(message.body).toBe('bodega@123 #test')
  })

  it('debe manejar mensajes con saltos de línea después del comando', () => {
    const message = { body: '/ai\npregunta en nueva línea' } as Message
    const result = readCommand(message)

    expect(result).toBe('ai')
    expect(message.body).toBe('pregunta en nueva línea')
  })
})
