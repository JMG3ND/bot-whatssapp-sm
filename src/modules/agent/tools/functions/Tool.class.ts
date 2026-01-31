import type { ChatCompletionTool } from '@modules/agent/types'

interface ToolConstructorParams {
  name: string
  toolDescription: ChatCompletionTool
  onEjectTool: (args: string) => Promise<string>
}

export class Tool {
  name: string
  toolDescription: ChatCompletionTool
  onEjectTool: (args: string) => Promise<string>

  constructor(toolConstructionParams: ToolConstructorParams) {
    const { name, toolDescription, onEjectTool } = toolConstructionParams
    this.name = name
    this.toolDescription = toolDescription
    this.onEjectTool = onEjectTool
  }

  async ejectTool(args: string): Promise<string> {
    return await this.onEjectTool(args).then(
      (result) => toolResponseFormatter(this.name, result),
    ).catch(
      (error) => {
        if (error instanceof ToolError)
          return toolResponseFormatter(this.name, error.toolError)
        throw error
      },
    )
  }
}

export class ToolError {
  toolError: string

  constructor(toolError: string) {
    this.toolError = toolError
  }
}

function toolResponseFormatter(toolName: string, message: string): string {
  return `Tool: ${toolName}\nResultado:\n${message}`
}
