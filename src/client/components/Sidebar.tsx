import React, { PureComponent } from 'react'

import { MainButton, SelectButton } from './Buttons'
import { InputText, TimezonePicker } from './Inputs'
import Sidetab from './Sidetab'
import Spinner from './Spinner'
import TimePicker from './Timepicker'

export interface TimezoneObj {
  value: string
  label: string
  abbrev: string
  offset: number
  altName: string
}

interface SidebarProps {
  status: number
  loginUser: string
  loginPassword: string
  loading: boolean
  getData: Function
  logout: Function
  onChange: Function
}
interface SidebarState {
  start: Date
  end: Date
  deviceOS: string
  deviceInfo: string
  userMessage: string
  userName: string
  timezone: TimezoneObj
}
type SidebarStateChange = Partial<SidebarState>

export const initTimezone: TimezoneObj = {
  value: 'GMT',
  label: '(GMT+0:00) UTC',
  abbrev: 'GMT',
  offset: 0,
  altName: 'GMT'
}

export const divider = {
  marginTop: '15px',
  width: '72%',
  borderTop: '.5px solid white'
}

export function adjustDateToSelectedTimezone(
  dateStr: string,
  timezoneOffset: number
): Date {
  // Find offset between local timezone and UTC in milliseconds
  const localTimezoneOffset = new Date().getTimezoneOffset() * 60 * 1000
  // Find offset between selected timezone and UTC in milliseconds
  const selectedTimezoneOffset = timezoneOffset * 60 * 60 * 1000
  // Return adjusted date from local timezone to selected timezone
  return new Date(
    new Date(dateStr).getTime() - localTimezoneOffset - selectedTimezoneOffset
  )
}

class Sidebar extends PureComponent<SidebarProps, SidebarState> {
  constructor(props) {
    super(props)
    this.state = {
      start: new Date(new Date().getTime() - 1000 * 60 * 60 * 24),
      end: new Date(),
      deviceOS: '',
      deviceInfo: '',
      userMessage: '',
      userName: '',
      timezone: initTimezone
    }
  }

  handleChange(state: SidebarStateChange): void {
    this.setState({ ...this.state, ...state })
  }

  handleTimezoneChange = (timezone: TimezoneObj): void => {
    this.setState({ ...this.state, timezone })
    this.props.onChange(timezone)
  }

  renderSearchButton = (props: SidebarProps): JSX.Element => {
    if (props.loading) return <Spinner color="white" />
    return (
      <MainButton
        label="Search"
        onClick={() => {
          const { start, end, timezone } = this.state
          this.props.getData({
            ...this.state,
            start:
              adjustDateToSelectedTimezone(
                start.toJSON(),
                timezone.offset
              ).getTime() / 1000,
            end:
              adjustDateToSelectedTimezone(
                end.toJSON(),
                timezone.offset
              ).getTime() / 1000,
            loginUser: this.props.loginUser,
            loginPassword: this.props.loginPassword
          })
        }}
      />
    )
  }

  render(): JSX.Element {
    return (
      <Sidetab serverName="Logs">
        {this.props.status === 200 ? (
          <>
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
            <TimezonePicker
              currentTimezone={this.state.timezone.value}
              onChange={this.handleTimezoneChange}
            />
            <SelectButton
              label="Device OS"
              options={{ '': '--', Android: 'Android', IOS: 'IOS' }}
              onChange={({ target: { value: deviceOS } }) =>
                this.handleChange({ deviceOS })
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
            <div>
              <hr style={divider} />
              <MainButton label="Logout" onClick={() => this.props.logout()} />
            </div>
          </>
        ) : null}
      </Sidetab>
    )
  }
}
export default Sidebar
