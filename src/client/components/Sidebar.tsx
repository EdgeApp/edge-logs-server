import React, { PureComponent } from 'react'
import Sidetab from './Sidetab'
import TimePicker from './Timepicker'
import Spinner from './Spinner'
import { InputText } from './Inputs'
import { MainButton, SelectButton } from './Buttons'

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

export const divider = {
  marginTop: '15px',
  width: '72%',
  borderTop: '.5px solid white'
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
    console.log(e.target.value)
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

  renderSearchButton = (props: SidebarProps): JSX.Element => {
    if (props.loading === true) return <Spinner />
    return (
      <MainButton
        label="Search"
        onClick={async () => {
          const {
            start,
            end,
            deviceType,
            deviceInfo,
            userMessage,
            userName
          } = this.state
          await this.props.getData({
            start: start.getTime() / 1000,
            end: end.getTime() / 1000,
            deviceType,
            deviceInfo,
            userMessage,
            userName
          })
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
        <SelectButton
          label="Device Type"
          options={{ '': '--', Android: 'Android', IOS: 'IOS' }}
          onClick={e => this.handleDeviceTypeChange(e)}
        />
        <InputText
          lines={3}
          label="Device Info"
          size="small"
          onChange={e => this.handleDeviceInfoChange(e)}
        />
        <InputText
          lines={5}
          label="User Message"
          size="large"
          onChange={e => this.handleUserMessageChange(e)}
        />
        <InputText
          lines={2}
          label="User Name"
          size="small"
          onChange={e => this.handleUserNameChange(e)}
        />
        <hr style={divider} />
        {this.renderSearchButton(this.props)}
      </Sidetab>
    )
  }
}
export default Sidebar
