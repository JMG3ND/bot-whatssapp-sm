import OpenAI from 'openai'
import 'dotenv/config'

const agent = new OpenAI({
  apiKey: process.env.LLM_API_KEY,
  baseURL: process.env.LLM_API_BASE_URL,
})

export default agent
