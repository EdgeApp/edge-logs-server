import {
  asOptional,
  asString,
  asObject,
  asArray,
  asUnknown,
  asNumber
} from 'cleaners'
import cors from 'cors'
import express from 'express'
import nano from 'nano'
import { rebuildCouch } from './util/rebuildCouch'
import { couchSchema } from './couchSchema'
import cookieParser from 'cookie-parser'

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

const retrievedLogObj = {
  _id: asString,
  timestamp: asNumber,
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
}

const asRetrievedLog = asObject(retrievedLogObj)

const asGetLog = asObject({
  _id: asString
})

const asFindLogsReq = asObject({
  start: asString,
  end: asString,
  deviceOs: asOptional(asString),
  deviceInfo: asOptional(asString),
  userMessage: asOptional(asString),
  userName: asOptional(asString)
})

const asLoginReq = asObject({
  _id: asString,
  authKey: asString
})

interface Selector {
  timestamp: { $gte: number; $lt: number }
  deviceOs?: { $eq: string }
  deviceInfo?: { $regex: string }
  userMessage?: { $regex: string }
  userName?: { $eq: string }
}

const nanoDb = nano(config.couchDbFullpath)

function main(): void {
  // start express and couch db server
  const app = express()
  const logsRecords = nanoDb.use('logs_records')
  const logsLogin = nanoDb.use('logs_login')

  app.use(express.json({ limit: '8mb' }))
  app.use(cors())
  app.use(cookieParser())
  app.use('/', express.static('dist'))

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    next()
  })

  app.put(`/v1/log/`, async function(req, res) {
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

  app.use(async function(req, res, next) {
    const loginData = req.query ?? req.body ?? {}
    if (loginData.loginUser === 'logout') {
      res.cookie('loginUser', '')
      res.cookie('loginPassword', '')
      return res.status(401).send(`Logout`)
    }
    if (loginData.loginUser == null)
      loginData.loginUser = req.cookies?.loginUser
    if (loginData.loginPassword == null)
      loginData.loginPassword = req.cookies?.loginPassword
    const { loginUser, loginPassword } = loginData
    try {
      const loginDoc = await logsLogin.get(loginUser)
      const cleanLogin = asLoginReq(loginDoc)
      if (cleanLogin.authKey !== loginPassword) throw new Error()
      res.cookie('loginUser', loginUser)
      res.cookie('loginPassword', loginPassword)
      next()
    } catch {
      res.cookie('loginUser', '')
      res.cookie('loginPassword', '')
      res.status(401).send(`Bad Login Info.`)
    }
  })

  app.get('/v1/getLog/', async function(req, res) {
    let query
    try {
      query = asGetLog(req.query)._id
    } catch (e) {
      res.status(400).send(`Missing Request fields.`)
      return
    }

    try {
      const log = await logsRecords.get(query)
      const cleanedLog = asRetrievedLog(log)
      res.json(cleanedLog)
    } catch (e) {
      console.log(e)
      if (e != null && e.error === 'not_found') {
        res.status(404).send(`Could not find log with _id: ${query}.`)
      } else {
        res.status(500).send(`Internal Server Error.`)
      }
    }
  })

  app.get(`/v1/findLogs/`, async function(req, res) {
    let logsQuery: ReturnType<typeof asFindLogsReq>
    try {
      logsQuery = asFindLogsReq(req.query)
    } catch {
      res.status(400).send(`Missing Request Fields`)
      return
    }

    const {
      start,
      end,
      deviceOs,
      deviceInfo,
      userMessage,
      userName
    } = logsQuery
    const startTimestamp = parseFloat(start)
    const endTimestamp = parseFloat(end)
    if (
      typeof startTimestamp !== 'number' ||
      typeof endTimestamp !== 'number' ||
      startTimestamp > endTimestamp
    ) {
      res.status(400).send(`Bad Timestamp Values.`)
      return
    }

    const selector: Selector = {
      timestamp: { $gte: startTimestamp, $lt: endTimestamp }
    }
    if (deviceOs !== undefined) {
      selector.deviceOs = { $eq: deviceOs }
    }
    if (deviceInfo !== undefined) {
      selector.deviceInfo = { $regex: deviceInfo }
    }
    if (userMessage !== undefined) {
      selector.userMessage = { $regex: userMessage }
    }
    if (userName !== undefined) {
      selector.userName = { $eq: userName }
    }

    const query = {
      selector,
      limit: 1000000,
      fields: Object.keys(retrievedLogObj).filter(field => field !== 'data')
    }

    try {
      // @ts-ignore
      const result = await logsRecords.find(query)
      return res.json(result.docs)
    } catch (e) {
      console.log(e)
      return res.status(500).send('Internal Server Error.')
    }
  })

  app.listen(config.httpPort, function() {
    console.log(`Server started on Port ${config.httpPort}`)
  })
}
rebuildCouch(config.couchDbFullpath, couchSchema)
  .then(() => main())
  .catch(e => console.log(e))
