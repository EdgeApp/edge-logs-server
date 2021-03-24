import React from 'react'

import { LoginButton } from './Buttons'
import Spinner from './Spinner'

interface LoginScreenProps {
  loading: boolean
  loginMessage: string
  loginUser: string
  loginPassword: string
  handleUserChange: Function
  handlePasswordChange: Function
  getData: Function
}

const loginMessage = {
  listStyleType: 'none' as 'none',
  textAlign: 'center' as 'center',
  fontSize: '24px'
}

const loginUserDiv = {
  listStyleType: 'none' as 'none',
  textAlign: 'center' as 'center',
  marginTop: '12px',
  marginRight: '10px'
}

const loginInput = {
  fontSize: '16px',
  width: '270px',
  borderWidth: '1px',
  color: 'black',
  outline: 'none' as 'none'
}

const LoginScreen: any = (props: LoginScreenProps) => {
  if (props.loading) return <Spinner color="blue" />
  return (
    <ul>
      <li style={loginMessage}>{props.loginMessage}</li>
      <li style={loginUserDiv}>
        <span>Username: </span>
        <input style={loginInput} onChange={e => props.handleUserChange(e)} />
      </li>
      <li style={loginUserDiv}>
        <span>Password: </span>
        <input
          style={loginInput}
          type="password"
          onChange={e => props.handlePasswordChange(e)}
        />
      </li>
      <li style={loginUserDiv}>
        <LoginButton
          label="Login"
          onClick={async () => {
            const today = new Date().getTime()
            const yesterday = today - 1000 * 60 * 60 * 24
            await props.getData({
              start: yesterday / 1000,
              end: today / 1000,
              loginUser: props.loginUser,
              loginPassword: props.loginPassword
            })
          }}
        />
      </li>
    </ul>
  )
}
export default LoginScreen
