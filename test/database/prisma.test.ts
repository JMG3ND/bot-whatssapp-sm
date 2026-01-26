import { describe, it, expect } from 'vitest'
import { prisma } from '../../src/database'

describe('Prisma Database Tests', () => {
  it('should connect to the database', async () => {
    const result = await prisma.$queryRaw`SELECT 1+1 AS result` as { result: bigint }[]
    expect(result).toBeDefined()
    expect(result[0].result).toBe(2n)
  })
})
