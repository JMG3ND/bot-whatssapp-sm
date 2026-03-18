import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
import type { ChatCompletionTool } from '../types'

const MCP_URL = 'http://localhost:5002/mcp'

let client: Client | null = null

async function getClient(): Promise<Client> {
  if (client) return client

  client = new Client({ name: 'bot-whatsapp', version: '1.0.0' })
  const transport = new StreamableHTTPClientTransport(new URL(MCP_URL))
  await client.connect(transport)

  return client
}

export async function getMcpTools(): Promise<ChatCompletionTool[]> {
  const mcpClient = await getClient()
  const { tools } = await mcpClient.listTools()

  return tools.map(tool => ({
    type: 'function',
    function: {
      name: tool.name,
      description: tool.description ?? '',
      parameters: tool.inputSchema,
    },
  }))
}

export async function callMcpTool(name: string, args: Record<string, unknown>): Promise<string> {
  const mcpClient = await getClient()
  const result = await mcpClient.callTool({ name, arguments: args })

  const textParts = (result.content as Array<{ type: string, text?: string }>)
    .filter(c => c.type === 'text' && c.text)
    .map(c => c.text!)

  return textParts.join('\n')
}

export async function closeMcpClient(): Promise<void> {
  if (client) {
    await client.close()
    client = null
  }
}
