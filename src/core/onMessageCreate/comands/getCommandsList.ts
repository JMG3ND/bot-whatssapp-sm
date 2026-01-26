import { listCommands } from './listCommands'

export function getCommandsList() {
  return listCommands.map(command =>
    `/${command.comandName}: ${command.description}`,
  ).join('\n\n')
}
