import React, { Component } from 'react'
import 'regenerator-runtime/runtime'
import Sidebar from './components/Sidebar'
import { searchLogs, fetchLog, SearchLogsParams, FetchLogParams } from '../util'
import './app.css'
import List from './components/List'
import LogView from './components/LogView'
import LoginScreen from './components/LoginScreen'

interface AppState {
  loading: boolean
  status: number
  data: any[]
  log: any
  loginMessage: string
  loginUser: string
  loginPassword: string
}
type AppStateChange = Partial<AppState>

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
      status: 0,
      data: [],
      log: {},
      loginMessage: 'Enter Username/Password',
      loginUser: '',
      loginPassword: ''
    }
  }

  async componentDidMount(): Promise<void> {
    Object.assign(document.body.style, body)
    const today = new Date().getTime()
    const yesterday = today - 1000 * 60 * 60 * 24
    const status = await this.getData({
      start: yesterday / 1000,
      end: today / 1000,
      loginUser: this.state.loginUser,
      loginPassword: this.state.loginPassword
    })
    if (
      status !== 200 &&
      (this.state.loginUser !== '' || this.state.loginPassword !== '')
    ) {
      this.setState({ loginMessage: 'Bad Username/Password' })
    }
  }

  handleChange(state: AppStateChange): void {
    this.setState({ ...this.state, ...state })
  }

  getData = async (params: SearchLogsParams): Promise<number> => {
    console.time('getData')
    this.setState({ loading: true })
    let response
    try {
      response = await searchLogs(params)
      this.setState({
        loading: false,
        data: response.data
      })
    } catch {
      this.setState({
        loading: false
      })
    }
    console.timeEnd('getData')
    return response.status
  }

  getLog = async (params: FetchLogParams): Promise<number> => {
    console.time('getLog')
    let response
    try {
      response = await fetchLog(params)
      this.setState({
        log: response.log
      })
    } catch {}
    console.timeEnd('getLog')
    return response.status
  }

  login = async (params: SearchParams): Promise<void> => {
    console.time('login')
    const response = await this.getData(params)
    if (response === 200) {
      this.setState({
        status: 200
      })
    }
    console.timeEnd('login')
  }

  logout = async (): Promise<void> => {
    const response = await this.getData({
      start: 0,
      end: 0,
      loginUser: 'logout'
    })
    this.setState({
      loading: false,
      status: response,
      data: [],
      loginMessage: 'Enter Username/Password',
      loginUser: '',
      loginPassword: ''
    })
  }

  renderMainView = (): JSX.Element => {
    if (this.state.status !== 200) {
      return (
        <LoginScreen
          loading={this.state.loading}
          loginMessage={this.state.loginMessage}
          handleUserChange={({ target: { value: loginUser } }) =>
            this.handleChange({ loginUser })
          }
          handlePasswordChange={({ target: { value: loginPassword } }) =>
            this.handleChange({ loginPassword })
          }
          loginUser={this.state.loginUser}
          loginPassword={this.state.loginPassword}
          getData={this.login}
        />
      )
    }
    if (Object.keys(this.state.log).length === 0) {
      return (
        <List
          data={this.state.data}
          getLog={this.getLog}
          loginUser={this.state.loginUser}
          loginPassword={this.state.loginPassword}
        />
      )
    }
    return (
      <LogView
        log={this.state.log}
        backFunction={() => this.handleChange({ log: {} })}
      />
    )
  }

  render(): JSX.Element {
    return (
      <div style={row}>
        <Sidebar
          status={this.state.status}
          loginUser={this.state.loginUser}
          loginPassword={this.state.loginPassword}
          loading={this.state.loading}
          getData={this.getData}
          logout={this.logout}
        />
        {this.renderMainView()}
      </div>
    )
  }
}
export default App
