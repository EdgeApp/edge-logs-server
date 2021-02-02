import React, { Component } from 'react'
import ReactJson from 'react-json-view'
import { fetchLog } from '../../util'
import { Link, Redirect, withRouter } from 'react-router-dom'

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
  width: '96%',
  margin: 'auto'
}

class LogView extends Component<LogViewProps, LogViewState> {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false,
      log: {}
    }
  }

  getLog = async (_id: string): Promise<any> => {
    console.time('getLog')
    const { loginUser, loginPassword } = this.props
    let response
    try {
      response = await fetchLog({ loginUser, loginPassword, _id })
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
    const dataArray: String[] = []
    log.data.data = log.data.data.split('\n')
    for (let i = 0; i < log.data.data.length; i += 100) {
      dataArray.push(log.data.data.slice(i, i + 100).join('\n'))
    }
    log.data.data = dataArray
    this.setState({
      log: log.data
    })
  }

  renderView = (): JSX.Element => {
    if (this.state.redirect || this.props.status === 401) {
      return <Redirect to={{ pathname: '/' }} />
    }
    return (
      <div style={logViewStyle}>
        <Link to="/">Back</Link>
        <ReactJson
          src={this.state.log}
          name="Log"
          theme="monokai"
          displayDataTypes={false}
          collapsed={2}
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
