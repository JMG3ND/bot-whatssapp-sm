import { saveError } from './saveError'
import consola from 'consola'
import type { Options } from './saveError'

export async function controlErrors(fn: () => unknown, options?: Options): Promise<void> {
  try {
    await fn()
  } catch (error) {
    await saveError(error, options)
    consola.error('An error occurred:', error)
  }
}
