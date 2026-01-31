import { montainConnection } from '@database'
import { formatDate } from '@utils'

interface Stock {
  UPC: string
  Description: string
  cantidad_cajas: number
  peso_libras: number
}

export async function getFrozenPacking(date?: string) {
  const validDate = date ? date : formatDate()

  const response = await montainConnection.$queryRaw`
  SELECT UPC, [Description], COUNT(*) cantidad_cajas, SUM(OrigWeight) peso_libras FROM vStockInfo
  WHERE CAST(PackDate AS DATE) = ${validDate}
  AND StationName = 'congelado'
  AND Void = 0
  GROUP BY UPC, [Description]
  `

  return response as Stock[]
}
