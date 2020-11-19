import { asOptional, asString, asObject, asArray, asUnknown } from 'cleaners'
import cors from 'cors'
import express from 'express'
import nano from 'nano'

import config from '../config.json'

const FIVE_MINUTES = 1000 * 60 * 5

const asLog = asObject({
  isoDate: asOptional(asString),
  uniqueId: asOptional(asString),
  userMessage: asOptional(asString),
  deviceInfo: asOptional(asString),
  appVersion: asOptional(asString),
  OS: asOptional(asString),
  acctRepoId: asOptional(asString),
  accounts: asOptional(
    asArray(
      asObject({
        username: asString,
        userId: asString
      })
    )
  ),
  loggedInUser: asOptional(
    asObject({
      userName: asString,
      userId: asString,
      wallets: asArray(
        asObject({
          currencyCode: asString,
          repoId: asOptional(asString),
          pluginDump: asOptional(asUnknown)
        })
      )
    })
  ),
  data: asString
})

const nanoDb = nano(config.couchDbFullpath)

function main(): void {
  // start express and couch db server
  const app = express()
  const logsRecords = nanoDb.use('logs_records')

  app.use(express.json())
  app.use(cors())
  app.use('/', express.static('dist'))

  app.put(`/api/v1/log/`, async function(req, res) {
    let log: ReturnType<typeof asLog>
    try {
      log = asLog(req.body)
    } catch {
      return res.status(400).send(`Bad Log Fields`)
    }
    let isoDate = new Date().toISOString()
    if (log.isoDate != null) {
      isoDate = log.isoDate
      const logMilliseconds = new Date(isoDate).getTime()
      const currentMilliseconds = new Date().getTime()
      if (
        logMilliseconds > currentMilliseconds + FIVE_MINUTES ||
        logMilliseconds < currentMilliseconds - FIVE_MINUTES
      ) {
        return res.status(400).send('Time Out of Sync')
      }
    }
    const uniqueId = log.uniqueId != null ? `_${log.uniqueId}` : ''
    const _id = `${isoDate}${uniqueId}`
    const timestamp = new Date(isoDate).getTime() / 1000
    const formattedLog = {
      _id,
      timestamp,
      ...log
    }
    try {
      await logsRecords.insert(formattedLog)
    } catch (e) {
      return res.status(500).send(`Could not save log to database.`)
    }
    res.json(formattedLog)
  })

  app.listen(config.httpPort, function() {
    console.log(`Server started on Port ${config.httpPort}`)
  })
}
main()
