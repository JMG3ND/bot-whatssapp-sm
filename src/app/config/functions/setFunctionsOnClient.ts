import type { Client } from 'whatsapp-web.js'
import printQrOnConsole from '../../../modules/onQR/printQrOnConsole'
import printReadyClient from '../../../modules/onReady/printReadyClient'
import { onMessageCreate } from '../../../modules/onMessageCreate'

/**
 * Configura los manejadores de eventos en la instancia del cliente de WhatsApp Web.js.
 * @param clientInstance Cliente de la instancia de whatsapp Web.js
 */
export function setFunctionsOnClient(clientInstance: Client) {
  clientInstance.on('ready', printReadyClient)
  clientInstance.on('qr', printQrOnConsole)
  clientInstance.on('message_create', onMessageCreate)
  clientInstance.on('auth_failure', (message) => {
    console.error('Authentication failure:', message)
  })
}
