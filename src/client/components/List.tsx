import React, { Component } from 'react'
import DataTable from 'react-data-table-component'
import { uiButton } from './Buttons'
import { Link } from 'react-router-dom'

interface ListProps {
  data: any[]
  loginUser: string
  loginPassword: string
}

class List extends Component<ListProps, {}> {
  cellFunction = (row: any, field: string): JSX.Element => {
    return (
      <Link style={uiButton} to={`/${row._id}`}>
        {row[field]}
      </Link>
    )
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
        />
      </>
    )
  }
}
export default List
