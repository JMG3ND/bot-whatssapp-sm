import { describe, it, expect, afterAll } from 'vitest'
import { saveError } from '../../src/utils/functions/saveError'
import fs from 'node:fs/promises'

describe('saveError', () => {
  afterAll(async () => {
    await fs.rm('./logs/test_errors.log', { force: true })
    await fs.rm('./logs/error.log', { force: true })
  })

  it('Debría guardar un error en el archivo de log', async () => {
    const options = { logName: 'test_errors.log' }

    await saveError('Este es un error de prueba', options)
    const data = await fs.readFile('./logs/test_errors.log', 'utf8')
    expect(data).toContain('Este es un error de prueba')
  })

  it('Debría guardar un error en el archivo de log con el nombre error.log', async () => {
    await saveError('Este es un error de prueba')
    const data = await fs.readFile('./logs/error.log', 'utf8')
    expect(data).toContain('Este es un error de prueba')
  })

  it('Debría guardar un error de tipo Error con el nombre del error como nombre del archivo de log', async () => {
    const error = new Error('Este es un error de tipo Error', { cause: 'Causa del error' })
    await saveError(error, { logName: 'should_be_overridden.log' })
    const data = await fs.readFile(`./logs/${error.name}.log`, 'utf8')
    expect(data).toContain('Este es un error de tipo Error')
  })
})
