import type { ChatCompletionTool } from '../../types'
import { formatDate } from '@utils'

export const obtener_fecha_actual: ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'obtener_fecha_actual',
    description: 'Te da la fecha actual',
  },
}

export async function getCurrentDate() {
  return `Tool: obtener_fecha_actual\nResultado:\nfecha actual:${formatDate()}`
}
