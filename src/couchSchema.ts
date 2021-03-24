/* eslint-disable no-var */

/**
 * Describes a single database that should exist.
 */
export interface CouchDbInfo {
  name: string
  indexes?: Array<{
    index: {
      fields: string[]
      partial_filter_selector?: any
    }
    ddoc: string
    name: string
    type: 'json'
  }>
  views?: Array<{
    name: string
    views: {
      [viewName: string]: {
        map?: string
        reduce?: string
      }
    }
  }>
}

export const couchSchema: CouchDbInfo[] = [
  {
    name: 'logs_records'
  },
  {
    name: 'logs_login'
  }
]
