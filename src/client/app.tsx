import React, { Component } from 'react'
import 'regenerator-runtime/runtime'
import Sidebar from './components/Sidebar'
import { searchLogs } from '../util'
import { instanceOf } from 'prop-types'
import './app.css'
import { Cookies, withCookies } from 'react-cookie'
import List from './components/List'
import LoginScreen from './components/LoginScreen'

interface AppState {
  loginMessage: string
  loginUser: string
  loginPassword: string
  status: number
  loading: boolean
  data: any[]
}
type AppStateChange = Partial<AppState>

interface SearchParams {
  loginUser: string
  loginPassword: string
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

class App extends Component<{ cookies: any }, AppState> {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  }

  constructor(props) {
    super(props)
    const { cookies } = props
    this.state = {
      loading: false,
      status: 0,
      data: [],
      loginMessage: 'Enter Username/Password',
      loginUser: cookies.get('loginUser'),
      loginPassword: cookies.get('loginPassword')
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

  getData = async (params: SearchParams): Promise<number> => {
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
    if (response.status === 200) {
      const { cookies } = this.props
      const cookieTimePeriod = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      cookies.set('loginUser', this.state.loginUser, {
        path: '/',
        expires: cookieTimePeriod
      })
      cookies.set('loginPassword', this.state.loginPassword, {
        path: '/',
        expires: cookieTimePeriod
      })
      this.setState({
        status: 200
      })
    }
    console.timeEnd('getData')
    return response.status
  }

  logout = (): void => {
    const { cookies } = this.props
    cookies.set('loginUser', '', { path: '/' })
    cookies.set('loginPassword', '', { path: '/' })
    this.setState({
      loading: false,
      status: 0,
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
          getData={this.getData}
        />
      )
    }
    return <List data={this.state.data} />
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
export default withCookies(App)
