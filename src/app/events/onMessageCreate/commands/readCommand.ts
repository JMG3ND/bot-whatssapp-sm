import { listCommands } from './listCommands'
import { Message } from 'whatsapp-web.js'

/**
 * Función que lee el comando del mensaje entrante.
 * Esta función muta el cuerpo del mensaje para eliminar el comando detectado.
 * @param message Mensaje entrante de WhatsApp
 * @returns cadena con el nombre del comando detectado o undefined si no se detecta ningún comando
 */
export function readCommand(message: Message){
  for(const command of listCommands){
    if(command.regex.test(message.body)){
      message.body = message.body.replace(command.regex, '').trim()
      return command.comandName
    }
  }
}
