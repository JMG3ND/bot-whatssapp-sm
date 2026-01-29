import type { ChatCompletionTool } from '../types'

import { obtener_stock_inventario } from './functions/obtenerStockInventario'
import { ejecutar_informe_trazabilidad } from './functions/ejecutar_informe_trazabilidad'

export const allTools: ChatCompletionTool[] = [
  obtener_stock_inventario,
  ejecutar_informe_trazabilidad,
]
