import React, { PureComponent } from 'react'
import Loader from 'react-loader-spinner'

const loader = {
  textAlign: 'center' as 'center',
  marginTop: '29px'
}

interface SpinnerProps {
  color: string
}

class Spinner extends PureComponent<SpinnerProps, {}> {
  render(): JSX.Element {
    return (
      <div style={loader}>
        <Loader
          type="Oval"
          color={this.props.color}
          height="30px"
          width="30px"
        />
      </div>
    )
  }
}
export default Spinner
