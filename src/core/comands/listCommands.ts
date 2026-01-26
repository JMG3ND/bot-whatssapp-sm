type ListCommands = { 
  comandName: string; 
  description: string;
  regex: RegExp 
};

export const listCommands: ListCommands[] = [
  {
    comandName: "ai",
    description: "Comando para interactuar con la inteligencia artificial",
    regex: /^\/ai\b/i
  },
]
