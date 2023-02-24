import nano from 'nano'

import { config } from '../config'
const nanoDb = nano(config.couchDbFullpath)

const searchTerm = process.argv[2]

if (searchTerm == null) {
  console.log('Missing search term')
  process.exit(1)
}

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

      const s = JSON.stringify(doc)
      if (s.includes(searchTerm ?? '')) {
        console.log(`Search item found in ${doc._id}`)
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
