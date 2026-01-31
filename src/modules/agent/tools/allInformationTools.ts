import type { ChatCompletionTool } from '../types'
import * as allTools from './functions'

export const allInformationTools: ChatCompletionTool[] = Object.values(allTools).map(tool => tool.toolDescription)
