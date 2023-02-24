import nano from 'nano'

import { config } from '../config'

const nanoDb = nano(config.couchDbFullpath)
const endsWith = '_activity'

rmLogs().catch(e => {
  console.error(e.message)
  process.exit(1)
})

async function rmLogs(): Promise<void> {
  let startkey
  const docsToDelete: any[] = []
  while (true) {
    const dbLogs = nanoDb.use('logs_records')
    const result = await dbLogs.list({ include_docs: false, startkey })
    for (const doc of result.rows) {
      if (doc.id.endsWith(endsWith)) {
        console.log(doc.id)
        docsToDelete.push({ _id: doc.id, _rev: doc.value.rev, _deleted: true })
      } else {
        // console.log('no match ' + doc.id)
      }
    }
    console.log(docsToDelete)
    await dbLogs.bulk({ docs: docsToDelete })
  }
}
