import { getClientInstance, setFunctionsOnClient } from './config'
import { controlErrors } from '@utils'
import { readEnviorements } from '@env'

async function main() {
  await controlErrors(async () => {
    await readEnviorements()
    const client = getClientInstance()
    setFunctionsOnClient(client)
    await client.initialize()
  })
}

main()
