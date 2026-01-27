import type { ChatCompletionTool } from './types'

import { obtener_stock_inventario } from './functions/obtenerStockInventario'

export const allTools: ChatCompletionTool[] = [
  obtener_stock_inventario,
]
