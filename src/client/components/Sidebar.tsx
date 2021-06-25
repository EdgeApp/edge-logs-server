import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'

import { MainButton, SelectButton } from './Buttons'
import { InputText } from './Inputs'
import Sidetab from './Sidetab'
import Spinner from './Spinner'
import TimePicker from './Timepicker'

interface SidebarProps {
  status: number
  loginUser: string
  loginPassword: string
  loading: boolean
  getData: Function
  logout: Function
}
interface SidebarState {
  start: Date
  end: Date
  deviceOS: string
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
      start: new Date(new Date().getTime() - 1000 * 60 * 60 * 24),
      end: new Date(),
      deviceOS: '',
      deviceInfo: '',
      userMessage: '',
      userName: ''
    }
  }

  handleChange(state: SidebarStateChange): void {
    this.setState({ ...this.state, ...state })
  }

  renderSearchButton = (props: SidebarProps): JSX.Element => {
    if (props.loading) return <Spinner color="white" />
    const query = Object.keys(this.state)
      .map(param => {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        if (param === 'start' || param === 'end') {
          const dateNum = this.state[param].getTime()
          return `${param}=${dateNum}`
        } else if (this.state[param] !== '') {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          return `${param}=${this.state[param]}`
        }
        return ''
      })
      .join('&')
    return (
      <Link to={`/?&${query}`}>
        <MainButton label="Search" onClick={async () => {}} />
      </Link>
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
