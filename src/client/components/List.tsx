import React, { Component } from 'react'
import DataTable from 'react-data-table-component'
import { Redirect } from 'react-router-dom'

import { uiButton } from './Buttons'

interface ListProps {
  data: any[]
  loginUser: string
  loginPassword: string
}

interface ListState {
  redirect: boolean
  log: string
}

class List extends Component<ListProps, ListState> {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false,
      log: ''
    }
  }

  cellFunction = (row: any, field: string): JSX.Element => {
    return (
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      <p style={uiButton} data-tag="allowRowEvents">{row[field]}</p>
    )
  }

  handleRowClicked = (row: any): any => {
    const log: string = row._id
    this.setState({ redirect: true, log })
  }

  render(): JSX.Element {
    const columns = [
      {
        name: 'Log ID',
        selector: '_id',
        sortable: true,
        cell: row => this.cellFunction(row, '_id')
      },
      {
        name: 'Device OS',
        selector: 'OS',
        sortable: true,
        cell: row => this.cellFunction(row, 'OS')
      },
      {
        name: 'Device Info',
        selector: 'deviceInfo',
        sortable: true,
        cell: row => this.cellFunction(row, 'deviceInfo')
      },
      {
        name: 'User Message',
        selector: 'userMessage',
        sortable: true,
        cell: row => this.cellFunction(row, 'userMessage')
      }
    ]

    return (
      <>
        <DataTable
          columns={columns}
          data={this.props.data}
          defaultSortField="_id"
          noHeader
          pagination
          pointerOnHover
          highlightOnHover
          onRowClicked={this.handleRowClicked}
        />
        {this.state.redirect && <Redirect to={`/${this.state.log}`} push />}
      </>
    )
  }
}
export default List
