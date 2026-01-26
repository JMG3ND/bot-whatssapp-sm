import fs from 'node:fs/promises'
import path from 'path'

export async function saveError(error: unknown, nameLog = 'errors.txt'): Promise<void> {
  const LOG_FILE = path.join(__dirname, '../../../', 'logs', nameLog)
  const line = `${new Date().toISOString()} - ${error}\n`
  await fs.mkdir(path.dirname(LOG_FILE), { recursive: true })
  await fs.appendFile(LOG_FILE, line, 'utf8')
}
