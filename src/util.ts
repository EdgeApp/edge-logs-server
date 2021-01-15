import config from '../config.json'

interface SearchParams {
  loginUser: string
  loginPassword?: string
  start: number
  end: number
  deviceOs?: string
  deviceInfo?: string
  userMessage?: string
  userName?: string
}

const endpoint = `https://${config.logsServerAddress}/v1/findLogs/?`

export const searchLogs = async (params: SearchParams): Promise<any> => {
  const query = Object.keys(params)
    .map(param => {
      if (params[param] !== '') return `${param}=${params[param]}`
      return ''
    })
    .join('&')
  const response = await fetch(endpoint + query)
  if (!response.ok) return { data: [], status: response.status }
  const data = await response.json()
  return { data, status: response.status }
}
