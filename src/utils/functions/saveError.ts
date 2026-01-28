import fs from 'node:fs/promises'
import path from 'path'

const DEFAULT_LOG_NAME = 'error.log'
const DEFAULT_LOG_DIR = 'logs'

export interface Options {
  logName?: string
  logDir?: string
}

function readOptions(options?: Options): Required<Options> {
  return {
    logName: options?.logName || DEFAULT_LOG_NAME,
    logDir: options?.logDir || DEFAULT_LOG_DIR,
  }
}

function writePath(options?: Options): string {
  const { logName, logDir } = readOptions(options)
  return path.join(logDir, logName)
}

function writeMessage(error: unknown): string {
  return `${new Date().toISOString()} - ${error}\n`
}

function modifyOptions(error: unknown, options: Options = {}) {
  if(error instanceof Error) {
    if(typeof options?.logName === 'string') return
    options.logName = error.name + '.log'
  }
}

/**
 * Esta funcion guarda un error en un archivo de log especificado.
 * El directorio por defecto es 'logs' y el nombre del archivo por defecto es 'error.log' relativo al directorio raíz del proyecto.
 * @param error Error que se necesita guardar
 * @param options Opciones para elegir nombre y directorio de donde se guardará el log
 */
export async function saveError(error: unknown, options?: Options): Promise<void> {
  modifyOptions(error, options)
  const logFile = writePath(options)
  const message = writeMessage(error)

  await fs.mkdir(path.dirname(logFile), { recursive: true })
  await fs.appendFile(logFile, message, 'utf8')
}
