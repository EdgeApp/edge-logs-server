import fetch from 'node-fetch'

import { logger } from './client/util'
import { config } from './config'

const { slackWebhookUrl } = config

const FIVE_MINUTES = 1000 * 60 * 5
let lastText = ''
let lastDate = 1591837000000 // June 10 2020

export const slackPoster = async (text: string): Promise<void> => {
  const now = Date.now()
  // check if it's been 5 minutes since last identical message was sent to Slack
  if (
    slackWebhookUrl == null ||
    slackWebhookUrl === '' ||
    (text === lastText && now - lastDate < FIVE_MINUTES) // 5 minutes
  ) {
    return
  }
  try {
    lastText = text
    lastDate = now
    await fetch(slackWebhookUrl, {
      method: 'POST',
      body: JSON.stringify({
        text: `${new Date(now).toISOString()} ${JSON.stringify(text)}`
      })
    })
  } catch (e) {
    logger('Could not log DB error to Slack', e)
  }
}
