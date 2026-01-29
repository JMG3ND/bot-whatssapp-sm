import { exectTrazabiltyStation } from '../../../database/tools/functions/exectTrazabiltyStation'
import { validateStations } from './validateStations'
import { formatDate } from '@database/tools/utils/formatDate'

export async function getTrazabilityStation(station: string) {
  if (!(await validateStations(station)))
    throw `La estación "${station}" no es válida.`

  const report = await exectTrazabiltyStation(station)

  if (report.length === 0) {
    throw `El día de hoy no se encontraron datos de trazabilidad para la estación "${station}".`
  }

  return `Reporte de trazabilidad para la estación "${station}" fecha: "${formatDate()}":\n\n${JSON.stringify(report, null, 2)}`
}
