import React, { PureComponent, useState } from 'react'
import TimezoneSelect, { ITimezoneOption } from 'react-timezone-select'

interface InputProps {
  lines: number
  label: string
  size: 'small' | 'large'
  onChange: Function
}

const containers = {
  large: {
    marginLeft: '26px',
    marginTop: '24px',
    display: 'flex',
    flexDirection: 'column' as 'column'
  },
  small: {
    marginLeft: '26px',
    marginTop: '16px',
    display: 'flex',
    flexDirection: 'column' as 'column'
  }
}

export const inputLabel = {
  fontSize: '16px',
  color: 'white'
}

export const style = (lines: number = 2): any => {
  const fontSize = 16
  const height = 2 + (fontSize + 2) * lines
  return {
    fontSize: `${fontSize}px`,
    backgroundColor: 'white',
    border: 'none',
    color: 'black',
    marginTop: '3px',
    minHeight: `${height}px`,
    width: '148px'
  }
}

export class InputText extends PureComponent<InputProps, {}> {
  render(): JSX.Element {
    const { lines, size, label, onChange } = this.props
    const textStyle = style(lines)
    return (
      <div style={containers[size]}>
        <div style={inputLabel}>{label}</div>
        <textarea style={textStyle} onChange={e => onChange(e)} />
      </div>
    )
  }
}

export const TimezonePicker = (props: any): JSX.Element => {
  // Declare a new state variable 'selectedTimezone' and set it initially to the timezone passed in as props
  // 'setSelectedTimezone' is a function to update 'selectedTimezone'
  const [selectedTimezone, setSelectedTimezone] = useState(
    props.currentTimezone
  )

  // Method to update the timezone information in the component, and in the parent
  const changeTimezone = (timezone: ITimezoneOption): void => {
    setSelectedTimezone(timezone) // Update 'selectedTimezone' to be the new timezone
    props.onChange(timezone) // Update state in parent component with new timezone
  }

  return (
    <>
      <div style={{ ...containers.small, width: '148px' }}>
        <div style={inputLabel}>Timezone</div>
        <TimezoneSelect value={selectedTimezone} onChange={changeTimezone} />
      </div>
    </>
  )
}
