import { formatDate } from '@utils'
import { Tool } from './Tool.class'

export const toolGetCurrentDate = new Tool({
  name: 'obtener_fecha_actual',
  toolDescription: {
    type: 'function',
    function: {
      name: 'obtener_fecha_actual',
      description: 'Te da la fecha actual',
    },
  },
  onEjectTool: async function () {
    return `Fecha actual: ${formatDate(new Date())}`
  },
})
