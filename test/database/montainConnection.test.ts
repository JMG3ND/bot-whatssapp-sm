import { describe, it, expect } from 'vitest'
import { montainConnection } from '../../src/database'

describe('Prisma Database Tests', () => {
  it('should connect to the database', async () => {
    const result = await montainConnection.$queryRaw`SELECT 1 AS result` as { result: number }[]
    expect(result).toBeDefined()
    expect(result[0].result).toBe(1)
  })
})
