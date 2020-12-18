import React, { Component } from 'react'
import 'regenerator-runtime/runtime'
import Sidebar from './components/Sidebar'
import { searchLogs } from '../util'
import './app.css'

interface AppState {
  loading: boolean
  data: any[]
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

  getData = async (
    start: number,
    end: number,
    deviceOs: string,
    deviceInfo: string,
    userMessage: string,
    userName: string
  ): Promise<void> => {
    console.time('getData')
    console.log(start, end)
    this.setState({ loading: true })
    const data = await searchLogs(
      start / 1000,
      end / 1000,
      deviceOs,
      deviceInfo,
      userMessage,
      userName
    )
    console.log(data)
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
