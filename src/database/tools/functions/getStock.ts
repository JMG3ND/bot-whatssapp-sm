import { montainConnection } from '../../database'

export async function getStock(description: string) {
  const stock = await montainConnection.$queryRaw`
    SELECT UPC, [Description], COUNT(*) cantidad_cajas, SUM(OrigWeight) peso_libras from vStockInfo
    WHERE [Description] LIKE '%' + ${description} + '%'
    and rebox = 0
    and void = 0
    and IdentOrder = 0
    and StorageName not like '#desc'
    and StorageName like '#%'
    GROUP BY [upc], [Description]
  `
  return stock
}
