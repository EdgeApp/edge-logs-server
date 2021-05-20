import React, { useState } from 'react'
import TimezoneSelect from 'react-timezone-select'

const containerStyle = {
  marginLeft: '26px',
  marginTop: '16px',
  display: 'flex',
  flexDirection: 'column' as 'column',
  width: '148px'
}

const inputLabelStyle = {
  fontSize: '16px',
  color: 'white'
}

const TimezonePicker = (props) => {
  // Declare a new state variable 'selectedTimezone' and set it initially to the timezone passed in as props
  // 'setSelectedTimezone' is a function to update 'selectedTimezone'
  const [selectedTimezone, setSelectedTimezone] = useState(props.currentTimezone)

  // Method to update the timezone information in the component, and in the parent
  const changeTimezone = (timezone) => {
    setSelectedTimezone(timezone) // Update 'selectedTimezone' to be the new timezone
    props.onChange(timezone) // Update state in parent component with new timezone
  }

  return (
    <>
      <div style={containerStyle}>
        <div style={inputLabelStyle}>Timezone</div>
        <TimezoneSelect
          value={selectedTimezone}
          onChange={changeTimezone}
        />
      </div>
    </>
  )
}

export default TimezonePicker
