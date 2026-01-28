import client from './createWSClient'
import printQrOnConsole from '../core/onQR/printQrOnConsole'
import printReadyClient from '../core/onReady/printReadyClient'
import { onMessageCreate } from '../core/onMessageCreate'

client.on('ready', printReadyClient)
client.on('qr', printQrOnConsole)
client.on('message_create', onMessageCreate)
client.on('auth_failure', (message) => {
  console.error('Authentication failure:', message)
})
client.on('authenticated', (message) => {
  console.error('Authentication:', message)
})

export default client
