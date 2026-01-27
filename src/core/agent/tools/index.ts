export * from './instructions'

export const tools = [
  {
    type: 'function' as const,
    function: {
      name: 'obtener_stock_inventario',
      description: 'Te da la lista del stock del inventario por descripción del producto',
      parameters: {
        type: 'object',
        properties: {
          descripción: {
            type: 'string',
            description: 'Descripción del producto a buscar en el inventario' },
        },
        required: ['descripción'],
      },
    },
  },
]
