import config from '../config.json'

export interface SearchLogsParams {
  loginUser: string
  loginPassword?: string
  start: number
  end: number
  deviceOS?: string
  deviceInfo?: string
  userMessage?: string
  userName?: string
}

export interface FetchLogParams {
  loginUser: string
  loginPassword?: string
  _id: string
}

const fetchApi = (endpoint: string) => async (params: any): Promise<any> => {
  const uri = `https://${config.logsServerAddress}/v1/${endpoint}/?`
  const query = Object.keys(params)
    .map(param => {
      if (params[param] !== '') return `${param}=${params[param]}`
      return ''
    })
    .join('&')
  const response = await fetch(uri + query)
  if (!response.ok && endpoint === 'findLogs')
    return { data: [], status: response.status }
  if (!response.ok && endpoint === 'getLog')
    return { data: {}, status: response.status }
  const data = await response.json()
  return { data, status: response.status }
}

export const searchLogs = fetchApi('findLogs')
export const fetchLog = fetchApi('getLog')
