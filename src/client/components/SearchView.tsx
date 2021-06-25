import React, { Component } from 'react'
import { Redirect, withRouter } from 'react-router-dom'

import List from './List'
// import LoginScreen from './LoginScreen'

// add interfaces for SearchView data

interface SearchViewProps {
  status: number
  loginUser: string
  loginPassword: string
  loading: boolean
  getData: Function
  logout: Function
  login: Function
  loginMessage: string
}

interface SearchViewState {
  redirect: boolean
  log: any
  data: any[]
  start: number
  end: number
  deviceOS: string
  deviceInfo: string
  userMessage: string
  userName: string
}

// add typing to input of component
class SearchView extends Component<SearchViewProps, SearchViewState> {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      redirect: false,
      log: {},
      start:
        new Date(
          new Date('December 17, 2020 03:24:00').getTime() - 1000 * 60 * 60 * 24
        ).getTime() / 1000,
      end: new Date().getTime() / 1000,
      deviceOS: '',
      deviceInfo: '',
      userMessage: '',
      userName: ''
    }
  }

  componentDidMount = async (): Promise<void> => {
    // const searchParams = this.props.match.params.searchParams
    // insert function to parse params from searchparams url
    // const params =
    // use params in getData function

    // const urlParams = new URLSearchParams(window.location.search)
    // const start =
    //   urlParams.get('start') === null
    //     ? ''
    //     : parseInt(urlParams.get('start'), 10)
    // const end =
    //   urlParams.get('end') === null ? '' : parseInt(urlParams.get('end'), 10)
    // const deviceOS =
    //   urlParams.get('deviceOS') === null ? '' : urlParams.get('deviceOS')
    // const deviceInfo =
    //   urlParams.get('deviceInfo') === null ? '' : urlParams.get('deviceInfo')
    // const userMessage =
    //   urlParams.get('userMessage') === null ? '' : urlParams.get('userMessage')
    // const userName =
    //   urlParams.get('userName') === null ? '' : urlParams.get('userName')
    console.log('user', this.props.loginUser)
    console.log('password', this.props.loginPassword)
    const parsedParams = {
      start:
        new Date(
          new Date('December 17, 2020 03:24:00').getTime() - 1000 * 60 * 60 * 24
        ).getTime() / 1000,
      end: new Date().getTime() / 1000,
      deviceOS: '',
      deviceInfo: '',
      userMessage: '',
      userName: '',
      loginUser: this.props.loginUser,
      loginPassword: this.props.loginPassword
    }
    // const response = await this.getData(parsedParams)
    // console.log(response)

    const log = await this.props.getData(parsedParams)
    if (log.status === 401) {
      this.setState({ redirect: true })
      return
    }
    this.setState({
      data: log.data
    })
  }

  renderSearchView = (): JSX.Element => {
    if (this.state.redirect || this.props.status === 401) {
      return <Redirect to={{ pathname: '/' }} />
    }
    // if (this.props.status !== 200) {
    //   return (
    //     <LoginScreen
    //       loading={this.props.loading}
    //       loginMessage={this.props.loginMessage}
    //       handleUserChange={({ target: { value: loginUser } }) =>
    //         this.props.handleChange({ loginUser })
    //       }
    //       handlePasswordChange={({ target: { value: loginPassword } }) =>
    //         this.props.handleChange({ loginPassword })
    //       }
    //       loginUser={this.props.loginUser}
    //       loginPassword={this.props.loginPassword}
    //       getData={this.props.login}
    //     />
    //   )
    // }
    return (
      <List
        data={this.state.data}
        loginUser={this.props.loginUser}
        loginPassword={this.props.loginPassword}
      />
    )
  }

  render(): JSX.Element {
    return <>{this.renderSearchView}</>
  }
}
export default withRouter(SearchView)
