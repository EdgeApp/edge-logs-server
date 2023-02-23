import React, { PureComponent } from 'react'
import { ColorRing } from 'react-loader-spinner'

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
        <ColorRing height="30px" width="30px" />
      </div>
    )
  }
}
export default Spinner
