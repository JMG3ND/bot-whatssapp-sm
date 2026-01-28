import { describe, expect, it } from 'vitest'
import { formatDate } from '../../../../src/database/tools/utils/formatDate'

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date(2024, 0, 5) // January 5, 2024
    const formatted = formatDate(date)
    expect(formatted).toBe('2024-01-05')
  })
})
