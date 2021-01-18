import React, { Component } from 'react'
import ReactJson from 'react-json-view'
import { BackButton } from './Buttons'

interface LogViewProps {
  log: any
  backFunction: Function
}

const logViewStyle = {
  width: '96%',
  margin: 'auto'
}

class LogView extends Component<LogViewProps, {}> {
  render(): JSX.Element {
    return (
      <div style={logViewStyle}>
        <BackButton onClick={() => this.props.backFunction()} label="Back" />
        <ReactJson
          src={this.props.log}
          name="Log"
          theme="monokai"
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
}
export default LogView
