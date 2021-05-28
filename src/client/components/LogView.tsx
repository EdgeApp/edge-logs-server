import DateTime from 'luxon/src/datetime.js'
import React, { Component } from 'react'
import ReactJson from 'react-json-view'
import { Link, Redirect, withRouter } from 'react-router-dom'

import { fetchLog } from '../util'
import { CollapseButton } from './Buttons'
import { TimezoneObj } from './Sidebar'

interface LogViewProps {
  match: any
  status: number
  loginUser: string
  loginPassword: string
  timezone: TimezoneObj
}

interface LogViewState {
  redirect: boolean
  collapsed: boolean
  log: any
  timezone: TimezoneObj
}

const logViewStyle = {
  width: '96%',
  margin: 'auto'
}
const linkStyle = {
  marginRight: '10px'
}

class LogView extends Component<LogViewProps, LogViewState> {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false,
      collapsed: false,
      log: {},
      timezone: props.timezone
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
        _id
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
      log: log.data
    })
  }

  renderView = (): JSX.Element => {
    if (this.state.redirect || this.props.status === 401) {
      return <Redirect to={{ pathname: '/' }} />
    }
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const rawData = `/raw/${this.props.match.params.logID}`
    const logDateUtc = new Date(this.state.log.timestamp * 1000)
    const shiftedTimezoneDate = DateTime.fromISO(logDateUtc.toJSON(), {
      zone: this.state.timezone.value
    }).toISO()
    return (
      <div style={logViewStyle}>
        <Link style={linkStyle} to="/">
          Back
        </Link>
        <Link style={linkStyle} to={rawData}>
          Raw Data
        </Link>
        <CollapseButton
          label={this.state.collapsed ? 'Expand' : 'Collapse'}
          onClick={() => this.setState({ collapsed: !this.state.collapsed })}
        />
        <ReactJson
          src={{ shiftedTimezoneDate, ...this.state.log }}
          name="Log"
          theme="monokai"
          displayDataTypes={false}
          collapsed={this.state.collapsed}
          style={{
            margin: '0 auto',
            width: '100%',
            minHeight: '30vh',
            maxHeight: '90vh',
            overflow: 'auto',
            whiteSpace: 'pre-line'
          }}
        />
      </div>
    )
  }

  render(): JSX.Element {
    return <>{this.renderView()}</>
  }
}
export default withRouter(LogView)
