import React, { Component } from 'react'
import { fetchLog } from '../../util'
import { Redirect, withRouter } from 'react-router-dom'

interface LogViewProps {
  match: any
  status: number
  loginUser: string
  loginPassword: string
}

interface LogViewState {
  redirect: boolean
  log: any
}

const logViewStyle = {
  width: '98%',
  margin: 'auto',
  whiteSpace: 'pre-line' as 'pre-line'
}

class RawLogView extends Component<LogViewProps, LogViewState> {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false,
      log: ''
    }
  }

  getLog = async (_id: string): Promise<any> => {
    console.time('getLog')
    const { loginUser, loginPassword } = this.props
    let response
    try {
      response = await fetchLog({
        loginUser,
        loginPassword,
        _id,
        withData: true
      })
    } catch {}
    console.timeEnd('getLog')
    return response
  }

  componentDidMount = async (): Promise<void> => {
    const logID = this.props.match.params.logID
    const log = await this.getLog(logID)
    if (log.status === 401) {
      this.setState({ redirect: true })
      return
    }
    this.setState({
      log: log.data.data
    })
  }

  renderView = (): JSX.Element => {
    if (this.state.redirect || this.props.status === 401) {
      return <Redirect to={{ pathname: '/' }} />
    }
    return <div style={logViewStyle}>{this.state.log}</div>
  }

  render(): JSX.Element {
    return <>{this.renderView()}</>
  }
}
export default withRouter(RawLogView)
