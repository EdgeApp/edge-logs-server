import React, { PureComponent } from 'react'

const secondaryButton = {
  outline: 'none',
  backgroundColor: 'transparent' as 'transparent',
  fontSize: '16px',
  cursor: 'pointer' as 'pointer',
  width: '100%',
  paddingTop: '12px',
  textAlign: 'left' as 'left',
  marginLeft: '20px',
  color: 'white',
  border: 'none'
}

const mainButton = {
  overflow: 'hidden' as 'hidden',
  outline: 'none',
  backgroundColor: 'transparent' as 'transparent',
  fontSize: '16px',
  cursor: 'pointer' as 'pointer',
  marginTop: '12px',
  marginLeft: '68px',
  marginBottom: '12px',
  color: 'white',
  border: '1px solid white'
}

const timePeriodButton = {
  outline: 'none',
  backgroundColor: 'transparent' as 'transparent',
  fontSize: '16px',
  cursor: 'pointer' as 'pointer',
  marginRight: '20px',
  border: 'none'
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

export const uiButton = {
  overflow: 'hidden' as 'hidden',
  outline: 'none',
  backgroundColor: 'transparent' as 'transparent',
  fontSize: '16px',
  cursor: 'pointer' as 'pointer',
  color: 'black',
  border: 'none'
}

interface UIButtonProps {
  onClick: any
  label: string
}

export class UIButton extends PureComponent<UIButtonProps, {}> {
  render(): JSX.Element {
    return (
      <button style={uiButton} onClick={this.props.onClick}>
        {this.props.label}
      </button>
    )
  }
}
