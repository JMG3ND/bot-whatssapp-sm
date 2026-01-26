import OpenAI from 'openai'
import 'dotenv/config'

const agent = new OpenAI({
  apiKey: process.env.LLM_API_KEY,
  baseURL: 'https://api.deepseek.com',
})

export default agent
