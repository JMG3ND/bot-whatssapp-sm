import { montainConnection } from '@database'
import { formatDate } from '@utils'

interface Stock {
  UPC: string
  Description: string
  cantidad_cajas: number
  peso_libras: number
}

export async function getProcessedProducts(station: string, date?: string) {
  const validDate = date ? date : formatDate()

  const response = await montainConnection.$queryRaw`
  SELECT UPC, [Description], COUNT(*) cantidad_de_etiquetas_impresas, SUM(OrigWeight) peso_en_libras FROM vStockInfo
  WHERE CAST(PackDate AS DATE) = ${validDate}
  AND StationName = ${station}
  AND Void = 0
  GROUP BY UPC, [Description]
  `

  return response as Stock[]
}
