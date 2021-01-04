import config from '../config.json'

interface SearchParams {
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
  return response.json()
}
