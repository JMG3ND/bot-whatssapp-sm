import { montainConnection } from '../../montainConnection'
import { formatDate } from '../utils/formatDate'

type TrazabilityStationResult = {
  ESPECIE: string;
  UPC: string;
  ENTRADA: string;
  SALIDA: string;
  DIFERENCIA: string;
  '%_DIFERENCIA': string;
  ETIQUETA_ENTRADA: string;
  ETIQUETA_SALIDA: string;
}

export async function exectTrazabiltyStation(station: string, date?: string) {
  const queryDate = date || formatDate()
  const result = await montainConnection.$queryRaw`
    exec trasabilitystation ${queryDate}, ${station}
  `
  return result as TrazabilityStationResult[]
}
