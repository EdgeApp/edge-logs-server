import React, { PureComponent } from 'react'

const button = {
  outline: 'none',
  backgroundColor: 'transparent' as 'transparent',
  fontSize: '16px',
  cursor: 'pointer' as 'pointer'
}

const secondaryButton = {
  ...button,
  width: '100%',
  paddingTop: '12px',
  textAlign: 'left' as 'left',
  marginLeft: '20px',
  color: 'white',
  border: 'none'
}

const mainButton = {
  ...button,
  overflow: 'hidden' as 'hidden',
  marginTop: '12px',
  marginLeft: '68px',
  marginBottom: '12px',
  color: 'white',
  border: '1px solid white'
}

const timePeriodButton = {
  ...button,
  marginRight: '20px',
  border: 'none'
}

export const uiButton = {
  ...button,
  overflow: 'hidden' as 'hidden',
  color: 'black',
  border: 'none',
  textDecoration: 'none'
}

const loginButton = {
  ...uiButton,
  border: '1px solid black'
}

const collapseButton = {
  ...uiButton,
  border: 'none',
  color: 'blue',
  textDecoration: 'underline',
  marginLeft: '-6px'
}

interface buttonProps {
  label: string
  onClick: () => void
}

export class MainButton extends PureComponent<buttonProps, {}> {
  render(): JSX.Element {
    return (
      <button style={mainButton} onClick={() => this.props.onClick()}>
        {this.props.label}
      </button>
    )
  }
}

export class SecondaryButton extends PureComponent<buttonProps, {}> {
  render(): JSX.Element {
    return (
      <button style={secondaryButton} onClick={() => this.props.onClick()}>
        {this.props.label}
      </button>
    )
  }
}

export class TimePeriodButton extends PureComponent<buttonProps, {}> {
  render(): JSX.Element {
    return (
      <button style={timePeriodButton} onClick={() => this.props.onClick()}>
        {this.props.label}
      </button>
    )
  }
}

export class LoginButton extends PureComponent<buttonProps, {}> {
  render(): JSX.Element {
    return (
      <button style={loginButton} onClick={() => this.props.onClick()}>
        {this.props.label}
      </button>
    )
  }
}

export class CollapseButton extends PureComponent<buttonProps, {}> {
  render(): JSX.Element {
    return (
      <button style={collapseButton} onClick={() => this.props.onClick()}>
        {this.props.label}
      </button>
    )
  }
}

interface SelectButtonProps {
  label: string
  options: { [option: string]: string }
  onChange: Function
}

export const largeContainer = {
  marginLeft: '26px',
  marginTop: '24px',
  display: 'flex',
  flexDirection: 'column' as 'column'
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

export class SelectButton extends PureComponent<SelectButtonProps, {}> {
  render(): JSX.Element {
    const { options, label, onChange } = this.props
    return (
      <div style={largeContainer}>
        <div style={inputLabel}>{label}</div>
        <select style={deviceTypeInput} onChange={e => onChange(e)}>
          {Object.keys(options).map(option => (
            <option key={option} value={option}>
              {options[option]}
            </option>
          ))}
        </select>
      </div>
    )
  }
}
