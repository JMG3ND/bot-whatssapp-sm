import { describe, expect, it, afterAll } from 'vitest'
import { controlErrors } from '../../src/utils'
import fs from 'node:fs/promises'

describe('controlErrors', () => {

  const fileTestName = 'test-errors.log'

  afterAll(async () => {
    await fs.unlink(`logs/${fileTestName}`)
  })

  it('should execute the function without errors', async () => {
    await controlErrors(async () => {
      throw new Error('Test error')
    },{ logName: fileTestName })

    const file = await fs.readFile(`logs/${fileTestName}`, 'utf-8')
    expect(file).toContain('Test error')
  })
})
