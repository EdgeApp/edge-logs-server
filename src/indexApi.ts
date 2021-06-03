/* eslint-disable @typescript-eslint/no-misused-promises */

import {
  asArray,
  asNumber,
  asObject,
  asOptional,
  asString,
  asUnknown
} from 'cleaners'
import cluster from 'cluster'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import {
  autoReplication,
  forkChildren,
  makePeriodicTask,
  rebuildCouch
} from 'edge-server-tools'
import express from 'express'
import nano, { MangoSelector } from 'nano'

import { config } from './config'
import { couchSchema } from './couchSchema'

const AUTOREPLICATION_DELAY = 1000 * 60 * 30 // 30 minutes
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
  data: asOptional(asString)
}

const asRetrievedLog = asObject(retrievedLogObj)

const asGetLog = asObject({
  _id: asString,
  withData: asOptional(asString)
})

const asFindLogsReq = asObject({
  start: asString,
  end: asString,
  deviceOS: asOptional(asString),
  deviceInfo: asOptional(asString),
  userMessage: asOptional(asString),
  userName: asOptional(asString)
})

const asLoginReq = asObject({
  _id: asString,
  authKey: asString
})

const nanoDb = nano(config.couchDbFullpath)
const limit = config.payloadLimitMb

function api(): void {
  // start express and couch db server
  const app = express()
  const logsRecords = nanoDb.use('logs_records')
  const logsLogin = nanoDb.use('logs_login')

  app.use(express.json({ limit }))
  app.use(cors())
  app.use(cookieParser())
  app.use('/', express.static('dist'))

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    next()
  })

  app.put(`/v1/log/`, async function (req, res) {
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

  app.use(async function (req, res, next) {
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
      // @ts-expect-error
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

  app.get('/v1/getLog/', async function (req, res) {
    let _id
    let withData = false
    try {
      const query = asGetLog(req.query)
      _id = query._id
      if (query.withData === 'true') withData = true
    } catch (e) {
      res.status(400).send(`Missing Request fields.`)
      return
    }

    try {
      const log = await logsRecords.get(_id)
      const cleanedLog = asRetrievedLog(log)
      if (!withData) delete cleanedLog.data
      res.json(cleanedLog)
    } catch (e) {
      console.log(e)
      if (e != null && e.error === 'not_found') {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        res.status(404).send(`Could not find log with _id: ${_id}.`)
      } else {
        res.status(500).send(`Internal Server Error.`)
      }
    }
  })

  app.get(`/v1/findLogs/`, async function (req, res) {
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
      deviceOS,
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

    const selector: MangoSelector = {
      timestamp: { $gte: startTimestamp, $lt: endTimestamp }
    }
    if (deviceOS !== undefined) {
      selector.OS = { $regex: `(?i)${deviceOS}` }
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
      const result = await logsRecords.find(query)
      return res.json(result.docs)
    } catch (e) {
      console.log(e)
      return res.status(500).send('Internal Server Error.')
    }
  })

  const { listenPort, listenHost } = config
  app.listen(listenPort, listenHost, () => {
    console.log(`Server started on Port ${listenPort}`)
  })
}

async function main(): Promise<void> {
  const { couchDbFullpath, infoServerAddress, infoServerApiKey } = config
  if (cluster.isMaster) {
    await rebuildCouch(couchDbFullpath, couchSchema).catch(e => console.log(e))
    const task = makePeriodicTask(
      async () =>
        await autoReplication(
          infoServerAddress,
          'logsServer',
          infoServerApiKey,
          couchDbFullpath
        ).catch(e => console.log(e)),
      AUTOREPLICATION_DELAY
    )
    task.start()
    forkChildren()
  } else {
    api()
  }
}

main().catch(e => console.log(e))
