import { Client, LocalAuth } from 'whatsapp-web.js'

/**
 * Obtiene la instancia del cliente de WhatsApp Web.
 * @returns {Client} Instancia del cliente de WhatsApp Web.
 */
export function getClientInstance(): Client {
  return new Client({
    authStrategy: new LocalAuth(),
  })
}
