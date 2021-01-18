import config from '../config.json'

export interface SearchLogsParams {
  loginUser: string
  loginPassword?: string
  start: number
  end: number
  deviceOs?: string
  deviceInfo?: string
  userMessage?: string
  userName?: string
}

export interface FetchLogParams {
  loginUser: string
  loginPassword?: string
  _id: string
}

const searchLogsEndpoint = `https://${config.logsServerAddress}/v1/findLogs/?`

export const searchLogs = async (params: SearchLogsParams): Promise<any> => {
  const query = Object.keys(params)
    .map(param => {
      if (params[param] !== '') return `${param}=${params[param]}`
      return ''
    })
    .join('&')
  const response = await fetch(searchLogsEndpoint + query)
  if (!response.ok) return { data: [], status: response.status }
  const data = await response.json()
  return { data, status: response.status }
}

const fetchLogEndpoint = `https://${config.logsServerAddress}/v1/getLog/?`

export const fetchLog = async (params: FetchLogParams): Promise<any> => {
  const query = Object.keys(params)
    .map(param => {
      if (params[param] !== '') return `${param}=${params[param]}`
      return ''
    })
    .join('&')
  const response = await fetch(fetchLogEndpoint + query)
  if (!response.ok) return { log: {}, status: response.status }
  const log = await response.json()
  return { log, status: response.status }
}
