import React, { Component } from 'react'
import DataTable from 'react-data-table-component'
import { Link } from 'react-router-dom'

import { SearchParams } from '../app'
import { uiButton } from './Buttons'

interface ListProps {
  getData: Function
  parsedParams: SearchParams
  loginUser: string
  loginPassword: string
}
interface ListState {
  redirect: boolean
  data: any[]
}

class List extends Component<ListProps, ListState> {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false,
      data: []
    }
  }

  cellFunction = (row: any, field: string): JSX.Element => {
    return (
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      <Link style={uiButton} to={`/${row._id}`}>
        {row[field]}
      </Link>
    )
  }

  componentDidMount = async (): Promise<void> => {
    const params = this.props.parsedParams
    console.log('parsedParams', params)
    const logs = await this.props.getData(params)
    if (logs.status === 401) {
      this.setState({ redirect: true })
      return
    }
    this.setState({
      data: logs.data
    })
    console.log('logs', logs)
    console.log('list data', this.state.data)
  }

  render(): JSX.Element {
    console.log('Data', this.state.data)
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
          data={this.state.data}
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
