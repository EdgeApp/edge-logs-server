import config from '../config.json'

interface SearchParams {
  start: number
  end: number
  deviceOs?: string
  deviceInfo?: string
  userMessage?: string
  userName?: string
}

const endpoint = `http://localhost:${config.httpPort}/v1/findLogs/?`

export const searchLogs = async (params: SearchParams): Promise<any> => {
  const query = Object.keys(params)
    .map(param => `${param}=${params[param]}`)
    .join('&')
  const response = await fetch(endpoint + query)
  return response.json()
}
