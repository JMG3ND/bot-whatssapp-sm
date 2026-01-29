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

export async function exectTrazabiltyStation(station: string) {
  const date = formatDate()
  const result = await montainConnection.$queryRaw`
    exec trasabilitystation ${date}, ${station}
  `
  return result as TrazabilityStationResult[]
}
