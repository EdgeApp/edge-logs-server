import { makeConfig } from 'cleaner-config'
import { asNumber, asObject, asOptional, asString } from 'cleaners'

export const asConfig = asObject({
  slackWebhookUrl: asOptional(asString),

  // HTTP server options:
  listenHost: asOptional(asString, '127.0.0.1'),
  listenPort: asOptional(asNumber, 8000),
  payloadLimitMb: asOptional(asString, '16mb'),

  // External resources:
  couchDbFullpath: asOptional(asString, 'http://admin:admin@localhost:5984'),
  infoServerAddress: asOptional(asString, 'info1.edge.app'),
  infoServerApiKey: asOptional(asString, '')
})

export const config = makeConfig(asConfig)
