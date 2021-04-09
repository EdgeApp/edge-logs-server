import { makeConfig } from 'cleaner-config'
import { asObject, asOptional, asString } from 'cleaners'

export const asConfig = asObject({
  couchDbFullpath: asOptional(asString, 'http://admin:admin@localhost:5984'),
  dbUsername: asOptional(asString, 'username'),
  dbPassword: asOptional(asString, 'password'),
  infoServerAddress: asOptional(asString, 'info1.edge.app'),
  infoServerApiKey: asOptional(asString, ''),
  hostname: asOptional(asString, ''),
  httpPort: asOptional(asString, ''),
  logsServerAddress: asOptional(asString, '')
})

export const config = makeConfig(asConfig)
