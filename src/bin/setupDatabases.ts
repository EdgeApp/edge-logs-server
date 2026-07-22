import { setupDatabase } from 'edge-server-tools'

import { config } from '../config'
import { setupInfos } from '../couchSchema'

const createDatabases = async (): Promise<void> => {
  for (const setupInfo of setupInfos) {
    await setupDatabase(config.couchDbFullpath, setupInfo)
  }
}

createDatabases()
  .then(() => process.exit(0))
  .catch(e => {
    console.log('createDatabases failure', e)
    process.exit(1)
  })
