import { makeConfig } from 'cleaner-config'
import { asNumber, asObject, asOptional, asString, Cleaner } from 'cleaners'

// Custom cleaners:

const asNumberString: Cleaner<string> = raw => {
  const numStr = asString(raw)
  if (!/^\d+(?:.\d+)$/.test(numStr)) {
    throw TypeError('Expected number string')
  }
  return numStr
}

// ENV:

const asEnv = asObject({
  // Couch
  COUCH_HOSTNAME: asOptional(asString, 'localhost'),
  COUCH_USERNAME: asOptional(asString, 'admin'),
  COUCH_PASSWORD: asOptional(asString, 'password'),
  COUCH_PORT: asOptional(asString, '5984'),
  // App Server
  HTTP_PORT: asOptional(asNumberString, '8008'),
  // Info Server
  INFO_SERVER_ADDRESS: asOptional(asString, 'info1.edge.app'),
  INFO_SERVER_API_KEY: asOptional(asString, '')
})
const env = asEnv(process.env)

// Config:

export const asConfig = asObject({
  // Couch
  couchDbFullpath: asOptional(
    asString,
    `http://${env.COUCH_USERNAME}:${env.COUCH_PASSWORD}@${env.COUCH_HOSTNAME}:${env.COUCH_PORT}`
  ),
  // App Server
  httpPort: asOptional(asNumber, parseInt(env.HTTP_PORT)),
  // Info Server
  infoServerAddress: asOptional(asString, env.INFO_SERVER_ADDRESS),
  infoServerApiKey: asOptional(asString, env.INFO_SERVER_API_KEY),
  payloadLimitMb: asOptional(asString, '16mb')
})
export const config = makeConfig(asConfig)
