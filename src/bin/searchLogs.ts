import nano from 'nano'

import { config } from '../config'
import { checkForKeys } from '../util'

const nanoDb = nano(config.couchDbFullpath)

main().catch(e => {
  console.error(e.message)
  process.exit(1)
})

async function main(): Promise<void> {
  const dbLogs = nanoDb.use('logs_records')
  let bookmark

  while (true) {
    const result = await dbLogs.find({
      selector: {
        _id: {
          $gt: null
        }
      },
      limit: 100,
      bookmark,
      sort: [{ _id: 'desc' }]
    })
    let start = ''
    let end = ''

    for (const doc of result.docs) {
      if (start === '') {
        start = doc._id
      }
      end = doc._id
      const s = JSON.stringify(doc, null, 2)
      const lines = s.split('\n')
      let lnum = -1
      for (const line of lines) {
        lnum++
        const result = checkForKeys(line)
        if (result != null) {
          console.log(`Search items found in ${doc._id} line:${lnum}`)
          console.log(result)
          console.log('*****')
        }
      }
    }
    console.log(`Searched ${start} ${end}`)

    if (bookmark !== result.bookmark) {
      bookmark = result.bookmark
    } else {
      console.log('done')
      break
    }
  }
}
