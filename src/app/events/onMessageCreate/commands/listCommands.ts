interface ListCommands {
  comandName: NamesComands;
  description: string;
  regex: RegExp;
}

interface CommandsInfo {
  comandName: NamesComands;
  description: string;
}

type NamesComands = 'help' | 'ai' | 'trazability' | 'clear-memory';

const comandsInfo: CommandsInfo[] = [
  {
    comandName: 'help',
    description: 'Muestra la lista de comandos disponibles',
  },
  {
    comandName: 'ai',
    description: 'Interactúa con la inteligencia artificial',
  },
  {
    comandName: 'trazability',
    description: 'Envía los reportes de trazabilidad de estación, ejemplo:\n/trazability bodega',
  },
  {
    comandName: 'clear-memory',
    description: 'Limpia la memoria de la conversación actual',
  },
]

export const listCommands: ListCommands[] = comandsInfo.map(command => ({
  ...command,
  regex: new RegExp(`^/${command.comandName}`, 'i'),
}))

export const namesComands = Object.fromEntries(
  listCommands.map(command => [command.comandName, command.comandName]),
) as Record<NamesComands, NamesComands>
