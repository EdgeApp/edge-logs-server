import React, { Component } from 'react'
import DataTable from 'react-data-table-component'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import { uiButton } from './Buttons'

interface ListProps {
  data: any[]
  loginUser: string
  loginPassword: string
  history: RouteComponentProps['history']
}

class List extends Component<ListProps, {}> {
  cellFunction = (row: any, field: string): JSX.Element => {
    return (
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      <p style={uiButton} data-tag="allowRowEvents">
        {row[field]}
      </p>
    )
  }

  handleRowClicked = (row: any): void => {
    this.props.history.push(row._id)
  }

  render(): JSX.Element {
    const columns: any = [
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
          defaultSortFieldId="_id"
          noHeader
          pagination
          pointerOnHover
          highlightOnHover
          onRowClicked={this.handleRowClicked}
        />
      </>
    )
  }
}
export default withRouter(List)
