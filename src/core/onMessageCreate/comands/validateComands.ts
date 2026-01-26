import { listCommands } from './listCommands';

const regexCommand: RegExp[] = listCommands.map(command => command.regex);

/**
 * Valida si el cuerpo del mensaje dado coincide con alguno de los patrones de comando predefinidos.
 * @param messageBody Es el mensaje generado por el usuario.
 * @returns Un valor booleano que indica si el mensaje coincide con algún comando.
 */
export function validateCommand(messageBody: string): boolean {
  return regexCommand.some((regex) => regex.test(messageBody));
}
