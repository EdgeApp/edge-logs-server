import React, { PureComponent } from 'react'
import Sidetab from './Sidetab'
import TimePicker from './Timepicker'
import Spinner from './Spinner'
import { MainButton } from './Buttons'

interface SidebarProps {
  loading: boolean
  getData: any
}
interface SidebarState {
  start: Date
  end: Date
  deviceType: string
  deviceInfo: string
  userMessage: string
  userName: string
}

export const largeContainer = {
  marginLeft: '26px',
  marginTop: '24px',
  display: 'flex',
  flexDirection: 'column' as 'column'
}

export const smallContainer = {
  marginLeft: '26px',
  marginTop: '16px',
  display: 'flex',
  flexDirection: 'column' as 'column'
}

export const divider = {
  marginTop: '15px',
  width: '72%',
  borderTop: '.5px solid white'
}

export const inputLabel = {
  fontSize: '16px',
  color: 'white'
}

export const deviceTypeInput = {
  fontSize: '16px',
  backgroundColor: 'white',
  border: 'none',
  color: 'black',
  marginTop: '3px',
  width: '148px'
}

export const deviceInfoInput = {
  fontSize: '16px',
  backgroundColor: 'white',
  border: 'none',
  color: 'black',
  marginTop: '3px',
  minHeight: '50px',
  width: '148px'
}

export const userMessageInput = {
  fontSize: '16px',
  backgroundColor: 'white',
  border: 'none',
  color: 'black',
  marginTop: '3px',
  minHeight: '90px',
  width: '148px'
}

export const userNameInput = {
  fontSize: '16px',
  backgroundColor: 'white',
  border: 'none',
  color: 'black',
  marginTop: '3px',
  width: '148px'
}

class Sidebar extends PureComponent<SidebarProps, SidebarState> {
  constructor(props) {
    super(props)
    this.state = {
      start: new Date(),
      end: new Date(),
      deviceType: '',
      deviceInfo: '',
      userMessage: '',
      userName: ''
    }
  }

  handleStartChange(start: Date): void {
    console.log(start)
    this.setState({ start })
  }

  handleEndChange(end: Date): void {
    console.log(end)
    this.setState({ end })
  }

  handleDeviceTypeChange(e: any): void {
    this.setState({ deviceType: e.target.value })
  }

  handleDeviceInfoChange(e: any): void {
    this.setState({ deviceInfo: e.target.value })
  }

  handleUserMessageChange(e: any): void {
    this.setState({ userMessage: e.target.value })
  }

  handleUserNameChange(e: any): void {
    this.setState({ userName: e.target.value })
  }

  renderFields(): JSX.Element {
    const deviceType = (
      <div style={largeContainer}>
        <div style={inputLabel}>Device Type</div>
        <select
          style={deviceTypeInput}
          onChange={e => this.handleDeviceTypeChange(e)}
        >
          <option value="">--</option>
          <option value="Android">Android</option>
          <option value="IOS">IOS</option>
        </select>
      </div>
    )

    const deviceInfo = (
      <div style={smallContainer}>
        <div style={inputLabel}>Device Info</div>
        <textarea
          style={deviceInfoInput}
          onChange={e => this.handleDeviceInfoChange(e)}
        />
      </div>
    )
    const userMessage = (
      <div style={largeContainer}>
        <div style={inputLabel}>User Message</div>
        <textarea
          style={userMessageInput}
          onChange={e => this.handleUserMessageChange(e)}
        />
      </div>
    )
    const userName = (
      <div style={smallContainer}>
        <div style={inputLabel}>Username</div>
        <input
          style={userNameInput}
          onChange={e => this.handleUserNameChange(e)}
        />
      </div>
    )

    return (
      <>
        {deviceType}
        {deviceInfo}
        {userMessage}
        {userName}
      </>
    )
  }

  renderSearchButton = (props: SidebarProps): JSX.Element => {
    if (props.loading === true) return <Spinner />
    return (
      <MainButton
        label="Search"
        onClick={async () => {
          await this.props.getData(
            this.state.start.getTime(),
            this.state.end.getTime(),
            this.state.deviceType,
            this.state.deviceInfo,
            this.state.userMessage,
            this.state.userName
          )
        }}
      />
    )
  }

  render(): JSX.Element {
    return (
      <Sidetab serverName="Logs">
        <hr style={divider} />
        <TimePicker
          label="Start"
          timePicker
          date={this.state.start}
          onChange={e => this.handleStartChange(e)}
        />
        <TimePicker
          label="End"
          timePicker
          date={this.state.end}
          onChange={e => this.handleEndChange(e)}
        />
        {this.renderFields()}
        <hr style={divider} />
        {this.renderSearchButton(this.props)}
      </Sidetab>
    )
  }
}
export default Sidebar
