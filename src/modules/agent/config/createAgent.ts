import OpenAI from 'openai'
import { ENV } from '@env'

const agent = new OpenAI({
  apiKey: ENV.LLM_API_KEY,
  baseURL: ENV.LLM_API_BASE_URL,
})

export default agent
