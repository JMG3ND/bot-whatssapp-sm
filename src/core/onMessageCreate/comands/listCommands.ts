type ListCommands = { 
  comandName: string; 
  description: string;
  regex: RegExp 
};

export const listCommands: ListCommands[] = [
  {
    comandName: "help",
    description: "Muestra la lista de comandos disponibles",
    regex: /^\/help\b/i
  },
  {
    comandName: "ai",
    description: "Interactúa con la inteligencia artificial",
    regex: /^\/ai\b/i
  },
]
