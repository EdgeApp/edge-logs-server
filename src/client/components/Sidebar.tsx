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
type SidebarStateChange = Partial<SidebarState>

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

  handleChange(state: SidebarStateChange): void {
    this.setState({ ...this.state, ...state })
  }

  renderSearchButton = (props: SidebarProps): JSX.Element => {
    if (props.loading === true) return <Spinner />
    return (
      <MainButton
        label="Search"
        onClick={async () => {
          const { start, end } = this.state
          await this.props.getData({
            ...this.state,
            start: start.getTime() / 1000,
            end: end.getTime() / 1000
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
          onChange={start => this.handleChange({ start })}
        />
        <TimePicker
          label="End"
          timePicker
          date={this.state.end}
          onChange={end => this.handleChange({ end })}
        />
        <SelectButton
          label="Device Type"
          options={{ '': '--', Android: 'Android', IOS: 'IOS' }}
          onChange={({ target: { value: deviceType } }) =>
            this.handleChange({ deviceType })
          }
        />
        <InputText
          lines={3}
          label="Device Info"
          size="small"
          onChange={({ target: { value: deviceInfo } }) =>
            this.handleChange({ deviceInfo })
          }
        />
        <InputText
          lines={5}
          label="User Message"
          size="large"
          onChange={({ target: { value: userMessage } }) =>
            this.handleChange({ userMessage })
          }
        />
        <InputText
          lines={2}
          label="User Name"
          size="small"
          onChange={({ target: { value: userName } }) =>
            this.handleChange({ userName })
          }
        />
        <hr style={divider} />
        {this.renderSearchButton(this.props)}
      </Sidetab>
    )
  }
}
export default Sidebar
