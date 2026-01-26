import { describe, expect, it, afterAll } from 'vitest'
import { controlErrors } from '../../src/core/utils/controlErrors'
import fs from 'node:fs/promises'

describe('controlErrors', () => {

  const fileTestName = 'test-errors.txt'

  afterAll(async () => {
    // Clean up the log file after tests
    await fs.unlink(`logs/${fileTestName}`).catch(() => {})
  })

  it('should execute the function without errors', async () => {
    await controlErrors(async () => {
      throw new Error('Test error')
    },
    {
      nameLog: fileTestName,
    })

    const file = await fs.readFile(`logs/${fileTestName}`, 'utf-8')
    expect(file).toContain('Test error')
  })
})
