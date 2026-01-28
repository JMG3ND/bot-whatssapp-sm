import 'dotenv/config'
import consola from 'consola'

interface Enviorements {
  LLM_API_KEY: string
  LLM_API_BASE_URL: string
  BRAIN_DATABASE_URL: string
  MONTAIN_DATABASE_URL: string
  DB_NAME: string
  DB_USER: string
  DB_PASSWORD: string
  DB_HOST: string
}

export const ENV: Enviorements = {
  LLM_API_KEY: process.env.LLM_API_KEY || '',
  LLM_API_BASE_URL: process.env.LLM_API_BASE_URL || '',
  BRAIN_DATABASE_URL: process.env.BRAIN_DATABASE_URL || '',
  MONTAIN_DATABASE_URL: process.env.MONTAIN_DATABASE_URL || '',
  DB_NAME: process.env.DB_NAME || '',
  DB_USER: process.env.DB_USER || '',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_HOST: process.env.DB_HOST || '',
}

/**
 * Lee y valida las variables de entorno necesarias para la aplicación.
 */
export function readEnviorements() {
  return new Promise<void>((resolve) => {
    const hasError: string[] = []
    Object.keys(ENV).forEach((key) => {
      if (!ENV[key as keyof Enviorements]) {
        hasError.push(key)
      }
    })
    if (hasError.length > 0) {
      consola.error(`Faltan las siguientes variables de entorno:\n${hasError.join('\n')}`)
      process.exit(1)
    }
    resolve()
  })
}
