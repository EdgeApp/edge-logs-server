import 'regenerator-runtime/runtime'
import './app.css'

import React, { Component } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'

import { searchLogs, SearchLogsParams } from '../util'
import List from './components/List'
import LoginScreen from './components/LoginScreen'
import LogView from './components/LogView'
import RawLogView from './components/RawLogView'
import SearchView from './components/SearchView'
import Sidebar from './components/Sidebar'

interface AppState {
  loading: boolean
  status: number
  data: any[]
  loginMessage: string
  loginUser: string
  loginPassword: string
}
type AppStateChange = Partial<AppState>

export interface SearchParams {
  loginUser?: string
  loginPassword?: string
  start?: number
  end?: number
  deviceOS?: string
  deviceInfo?: string
  userMessage?: string
  userName?: string
}

interface APIGet {
  status: number
  data: any[]
}

interface ParsedParams {
  start: number | string
  end: number | string
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
    if (status.status === 200) {
      this.setState({
        status: 200
      })
    }
    if (
      status.status !== 200 &&
      (this.state.loginUser !== '' || this.state.loginPassword !== '')
    ) {
      this.setState({ loginMessage: 'Bad Username/Password' })
    }
  }

  handleChange(state: AppStateChange): void {
    this.setState({ ...this.state, ...state })
  }

  getData = async (params: any): Promise<APIGet> => {
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
    return response
  }

  login = async (params: any): Promise<void> => {
    console.time('login')
    const response = await this.getData(params)
    if (response.status === 200) {
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
      status: response.status,
      data: [],
      loginMessage: 'Enter Username/Password',
      loginUser: '',
      loginPassword: ''
    })
  }

  paramParser = (url): object => {
    const urlParams = new URLSearchParams(url)

    const start =
      urlParams.get('start') === null
        ? ''
        : parseInt(urlParams.get('start'), 10)
    const end =
      urlParams.get('end') === null ? '' : parseInt(urlParams.get('end'), 10)
    const deviceOS =
      urlParams.get('deviceOS') === null ? '' : urlParams.get('deviceOS')
    const deviceInfo =
      urlParams.get('deviceInfo') === null ? '' : urlParams.get('deviceInfo')
    const userMessage =
      urlParams.get('userMessage') === null ? '' : urlParams.get('userMessage')
    const userName =
      urlParams.get('userName') === null ? '' : urlParams.get('userName')

    const parsedParams = {
      start: start / 1000,
      end: end / 1000,
      deviceOS: deviceOS,
      deviceInfo: deviceInfo,
      userMessage: userMessage,
      userName: userName
    }

    console.log('parsed', parsedParams)
    return parsedParams
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
    console.log('pre login info', this.paramParser(window.location.href))

    const parsedParams: SearchParams = {
      ...this.paramParser(window.location.href),
      loginUser: this.state.loginUser,
      loginPassword: this.state.loginPassword
    }
    console.log('post login info', parsedParams)
    return (
      <List
        getData={this.getData}
        parsedParams={parsedParams}
        loginUser={this.state.loginUser}
        loginPassword={this.state.loginPassword}
      />
    )
  }

  // <Route
  //   exact
  //   path="/"
  //   // eslint-disable-next-line react/no-children-prop
  //   children={this.renderMainView}
  // />

  render(): JSX.Element {
    return (
      <HashRouter>
        <Switch>
          <Route
            path="/raw/:logID"
            // eslint-disable-next-line react/no-children-prop
            children={
              <RawLogView
                status={this.state.status}
                loginUser={this.state.loginUser}
                loginPassword={this.state.loginPassword}
              />
            }
          />
          <>
            <div style={row}>
              <Sidebar
                status={this.state.status}
                loginUser={this.state.loginUser}
                loginPassword={this.state.loginPassword}
                loading={this.state.loading}
                getData={this.getData}
                logout={this.logout}
              />
              <Route
                path="/:logID"
                // eslint-disable-next-line react/no-children-prop
                children={
                  <LogView
                    status={this.state.status}
                    loginUser={this.state.loginUser}
                    loginPassword={this.state.loginPassword}
                  />
                }
              />
              {/* <Route
                path="/?:searchParams"
                // eslint-disable-next-line react/no-children-prop
                children={
                  <SearchView
                    status={this.state.status}
                    loginUser={this.state.loginUser}
                    loginPassword={this.state.loginPassword}
                    loginMessage={this.state.loginMessage}
                    loading={this.state.loading}
                    getData={this.getData}
                    logout={this.logout}
                    login={this.login}
                  />
                }
              /> */}
              <Route
                path="/?:searchParams"
                // eslint-disable-next-line react/no-children-prop
                children={this.renderMainView}
              />
              {/* <Route
                exact
                path="/"
                // eslint-disable-next-line react/no-children-prop
                children={this.renderMainView()}
              /> */}
            </div>
          </>
        </Switch>
      </HashRouter>
    )
  }
}
export default App
