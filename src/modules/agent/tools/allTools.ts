import type { ChatCompletionTool } from '../types'

import { obtener_stock_inventario } from './functions/obtenerStockInventario'
import { ejecutar_informe_trazabilidad } from './functions/ejecutar_informe_trazabilidad'
import { obtener_empaque_por_estacion } from './functions/getTool.getFrozenPacking'
import { obtener_fecha_actual } from './functions/getTool.getCurrentDate'

export const allTools: ChatCompletionTool[] = [
  obtener_stock_inventario,
  ejecutar_informe_trazabilidad,
  obtener_empaque_por_estacion,
  obtener_fecha_actual,
]
