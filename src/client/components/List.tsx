import React, { Component } from 'react'
import DataTable from 'react-data-table-component'
import ReactJson from 'react-json-view'
import { UIButton } from './Buttons'

interface ListProps {
  data: any[]
}

interface ListState {
  selected: any
}

class List extends Component<ListProps, ListState> {
  constructor(props) {
    super(props)
    this.state = {
      selected: {}
    }
  }

  handleChange(selected: any): void {
    console.log(selected)
    this.setState({ selected })
  }

  render(): JSX.Element {
    const columns = [
      {
        name: 'Log ID',
        selector: '_id',
        sortable: true,
        cell: row => (
          <UIButton onClick={() => this.handleChange(row)} label={row._id} />
        )
      }
    ]

    return (
      <>
        <ReactJson
          src={this.state.selected}
          name="Log"
          theme="monokai"
          style={{
            margin: '0 auto',
            width: '94%',
            minHeight: '300px',
            maxHeight: '90vh',
            overflow: 'auto',
            whiteSpace: 'pre-line'
          }}
        />
        <DataTable
          columns={columns}
          data={this.props.data}
          noHeader
          pagination
          pointerOnHover
          highlightOnHover
        />
      </>
    )
  }
}
export default List
