import { montainConnection } from '@database/montainConnection'

interface Stock {
  UPC: string
  Description: string
  cantidad_cajas: number
  peso_libras: number
}

export async function getStock(description: string) {
  const stock = await montainConnection.$queryRaw`
    with stock as (
	SELECT UPC, [Description], COUNT(*) cantidad_cajas, SUM(OrigWeight) peso_libras from vStockInfo
    WHERE
    rebox = 0
    and void = 0
    and IdentOrder = 0
    and StorageName not like '#desc'
    and StorageName in (
      'FREEZER',
      '#01',
      '#02',
      '#03',
      '#04',
      '#05',
      '#06',
      '#07',
      '#08',
      '#09',
      '#10',
      '#11',
      '#12',
      '#13',
      '#14',
      '#15',
      '#16',
      '#17',
      '#18',
      '#19',
      '#20',
      '#21',
      '#22',
      '#23',
      '#24',
      '#25',
      '#26',
      '#27',
      '#28',
      '#29',
      '#30',
      '#31',
      '#32',
      '#33',
      '#34',
      '#35',
      '#36',
      '#37',
      '#38',
      '#39',
      '#40',
      '#41',
      '#42',
      '#ALM2_P#1',
      '#ALM2_P#2',
      '#PLAN2_P#1',
      '#PLAN2_P#2',
      '#PLAN2_P#3',
      '#ALM1_P#1',
      '#ALM1_P#2',
      '#ALM1_P#3',
      '#PLAN2_CON'
    )
    GROUP BY [upc], [Description]
  )

  SELECT 
    d.UPC, 
    d.Description,
      CASE 
          WHEN v.cantidad_cajas is null THEN 0
          ELSE v.cantidad_cajas
      END AS cantidad_cajas,
      CASE 
          WHEN v.peso_libras is null THEN 0
          ELSE v.peso_libras
      END AS peso_libras
  FROM dProduct d
  left join stock v on v.UPC = d.UPC
  left join dProductPropertyPivot dp on dp.IdentProduct = d.Identifier
  where PageTitle like 'CONGELADO'
  and CONCAT(d.UPC, d.Description, d.Description2 , d.Description3, dp.NameSPECIES) like '%' + ${description} + '%'
  `
  return stock as Stock[]
}
