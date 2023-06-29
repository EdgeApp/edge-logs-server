import { wordlists } from 'bip39'
import nano from 'nano'

import { config } from '../config'

// const bip39b = require('bip39')
const nanoDb = nano(config.couchDbFullpath)

// console.log(wordlists)
// console.log(bip39b)
// const searchTerms = process.argv.slice(2)

// if (searchTerms[0] == null) {
//   console.log('Missing search term')
//   process.exit(1)
// }

// const checkme =
//   'fault must outdoor spawn walk universe throw lonely embrace faculty bulb broken'

// const w = checkme.split(' ')
// let av = true
// for (const word of w) {
//   if (!wordlists.english.includes(word)) {
//     av = false
//     break
//   }
// }

// console.log(`checkme = ${av.toString()}`)

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
      // if (doc._id !== '2023-06-02T12:28:16.421Z_8e7d96_info') continue
      // console.log(`Checking docId ${doc._id}`)

      const s = JSON.stringify(doc, null, 2)
      const lines = s.split('\n')
      let lnum = -1
      for (const line of lines) {
        lnum++
        // if (lnum !== 146) continue
        const regex = /(\b[a-z]+\b\s){11,23}\b[a-z]+\b/g
        const matches = line.match(regex)
        const found = matches != null
        // let found = true
        // for (const searchTerm of searchTerms) {
        //   if (!s.includes(searchTerm ?? '')) {
        //     found = false
        //     break
        //   }
        // }
        if (found) {
          for (const match of matches) {
            const words = match.split(' ')
            let allValid = true
            for (const word of words) {
              if (!wordlists.english.includes(word)) {
                allValid = false
                break
              }
            }
            // const allValid = words.every(word =>
            //   bip39.wordlists.english.includes(word)
            // )
            if (allValid) {
              console.log(`Search items found in ${doc._id} line:${lnum}`)
              console.log(match)
              console.log('*****')
            }
          }
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
