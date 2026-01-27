import { describe, it, expect } from 'vitest'
import { prisma } from '../../src/database'

describe('Prisma Database Tests', () => {
  it('debería conectarse a la base de datos', async () => {
    const result = await prisma.$queryRaw`SELECT 1+1 AS result` as { result: bigint }[]
    expect(result).toBeDefined()
    expect(result[0].result).toBe(2n)
  })

  it('Debería dar la lista de conversaciones', async () => {

    const result = await prisma.conversation.findMany()
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
  })
})
