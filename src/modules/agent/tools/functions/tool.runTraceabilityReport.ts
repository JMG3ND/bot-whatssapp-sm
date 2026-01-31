import { isObject } from '@modules/agent/utils'
import { getTrazabilityStation } from '@modules/reports'
import { responseAnalisis , addInstructionsToReport } from '@modules/agent'
import { Tool, ToolError } from './Tool.class'

const RESPONSES = {
  INVALID_STATION: 'El argumento debe ser un objeto con una propiedad "station" de tipo string',
  INVALID_DATE: 'La fecha debe estar en formato AAAA-MM-DD',
}

export const toolRunTraceabilityReport = new Tool({
  name: 'ejecutar_informe_trazabilidad',
  toolDescription: {
    type: 'function',
    function: {
      name: 'ejecutar_informe_trazabilidad',
      description: 'Genera un informe de trazabilidad de una estación de trabajo específica, y una fecha determinada. Si no se da fecha la herraminta tomará la fecha actual. "USALO SOLO SI TE PIDEN QUE GENERES EL INFORME". La fecha no es obligatoria.',
      parameters: {
        type: 'object',
        properties: {
          station: {
            type: 'string',
            description: 'Nombre de la estación de trabajo para la cual se desea generar el informe de trazabilidad. La estación debe ser bodega, bodega2, congelado, fileteo o bandejeo',
          },
          date: {
            type: 'string',
            description: 'La fecha no es necesaria pero si la pasas debe estar en formato AAAA-MM-DD',
          },
        },
        required: ['station'],
      },
    },
  },
  onEjectTool: async function ejectTool(args: string) {
    const { station, date } = readArguments(args)

    const report = await getTrazabilityStation(station, date)
    const instructions = addInstructionsToReport(report)
    const response = await responseAnalisis(instructions)

    const addInformation = addContextToReport(response)

    const informeString = JSON.stringify(addInformation, null, 2)
    return informeString

  },
})

function addContextToReport(report: string) {
  return `Esta respuesta ya fue analizada por el AI tienes que replicar tu respuesta tal cual este reporte para que le llegue al ususario:\n\n${report}`
}

function readArguments(args: string): { station: string, date?: string } {
  const json = JSON.parse(args) as { station: string, date?: string }
  if (!isObject(json) || typeof json.station !== 'string')
    throw new ToolError(RESPONSES.INVALID_STATION)

  if (json.date && !/^\d{4}-\d{2}-\d{2}$/.test(json.date))
    throw new ToolError(RESPONSES.INVALID_DATE)

  return { station: json.station, date: json.date }
}
