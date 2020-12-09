import React, { Component } from 'react'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import TimePicker from 'rc-time-picker'
import 'rc-time-picker/assets/index.css'
import 'react-datepicker/dist/react-datepicker.css'

interface TimeProps {
  handleSidebarStart: any
  handleSidebarEnd: any
}

interface TimeState {
  startDate: Date
  startTime: moment.Moment
  endDate: Date
  endTime: moment.Moment
}

export const dateContainer = {
  marginTop: '36px',
  display: 'flex',
  flexDirection: 'column' as 'column'
}

export const timeContainer = {
  marginTop: '16px',
  display: 'flex',
  flexDirection: 'column' as 'column'
}

export const calendarText = {
  margin: 'auto',
  fontSize: '24px',
  color: 'white'
}

export const dateInput = {
  fontSize: '24px',
  backgroundColor: 'white',
  border: 'none',
  color: 'black',
  marginTop: '3px',
  marginLeft: '30px',
  width: '200px'
}

export const timeInput = {
  fontSize: '24px',
  marginTop: '3px',
  marginLeft: '30px',
  width: '200px'
}

class Time extends Component<TimeProps, TimeState> {
  constructor(props) {
    super(props)
    const startDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const time = moment()
    const endDate = new Date()
    this.state = {
      startDate,
      startTime: time,
      endDate,
      endTime: time
    }
  }

  handleStartDateChange(startDate: Date): void {
    this.setState({ startDate })
    this.props.handleSidebarStart(startDate, this.state.startTime)
  }

  handleStartTimeChange(startTime: moment.Moment): void {
    this.setState({ startTime })
    this.props.handleSidebarStart(this.state.startDate, startTime)
  }

  handleEndDateChange(endDate: Date): void {
    this.setState({ endDate })
    this.props.handleSidebarEnd(endDate, this.state.endTime)
  }

  handleEndTimeChange(endTime: moment.Moment): void {
    this.setState({ endTime })
    this.props.handleSidebarEnd(this.state.endDate, endTime)
  }

  render(): JSX.Element {
    const startDate = (
      <div style={dateContainer}>
        <div style={calendarText}>Start Date</div>
        <DatePicker
          customInput={<input style={dateInput} />}
          selected={this.state.startDate}
          onChange={e => this.handleStartDateChange(e)}
        />
      </div>
    )

    const startTime = (
      <div style={timeContainer}>
        <div style={calendarText}>Start Time</div>
        <TimePicker
          // @ts-ignore
          style={timeInput}
          value={this.state.startTime}
          onChange={e => this.handleStartTimeChange(e)}
        />
      </div>
    )

    const endDate = (
      <div style={dateContainer}>
        <div style={calendarText}>End Date</div>
        <DatePicker
          customInput={<input style={dateInput} />}
          selected={this.state.endDate}
          onChange={e => this.handleEndDateChange(e)}
        />
      </div>
    )

    const endTime = (
      <div style={timeContainer}>
        <div style={calendarText}>End Time</div>
        <TimePicker
          // @ts-ignore
          style={timeInput}
          value={this.state.endTime}
          onChange={e => this.handleEndTimeChange(e)}
        />
      </div>
    )
    return (
      <>
        {startDate}
        {startTime}
        {endDate}
        {endTime}
      </>
    )
  }
}
export default Time
