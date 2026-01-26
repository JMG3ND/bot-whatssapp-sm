import OpenAI from "openai"
import 'dotenv/config'

const agent = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com'
})

export default agent
