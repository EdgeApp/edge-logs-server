import React, { Component } from 'react'
import 'regenerator-runtime/runtime'
import Sidebar from './components/Sidebar'
import { searchLogs } from '../util'
import './app.css'

interface AppState {
  loading: boolean
  data: any[]
}

interface SearchParams {
  start: number
  end: number
  deviceOs?: string
  deviceInfo?: string
  userMessage?: string
  userName?: string
}

export const body = {
  margin: 0,
  padding: 0,
  height: '100%'
}

export const row = {
  width: '100%',
  height: '100%',
  display: 'table' as 'table',
  tableLayout: 'fixed' as 'fixed'
}

export const column = {
  minHeight: '100%',
  display: 'table-cell'
}

class App extends Component<{}, AppState> {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      data: []
    }
  }

  componentDidMount(): void {
    Object.assign(document.body.style, body)
  }

  getData = async (params: SearchParams): Promise<void> => {
    console.time('getData')
    this.setState({ loading: true })
    const data = await searchLogs(params)
    this.setState({
      loading: false,
      data
    })
    console.timeEnd('getData')
  }

  render(): JSX.Element {
    const data = this.state.data.map((object, index) => {
      return <div key={index}>{JSON.stringify(object)}</div>
    })
    return (
      <div style={row}>
        <Sidebar loading={this.state.loading} getData={this.getData} />
        <p>hellooooo</p>
        {data}
      </div>
    )
  }
}
export default App
