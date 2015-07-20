import React from 'react';
import Application from 'meepworks/application';

import 'normalize.css/normalize.css!';
import 'fixed-data-table/dist/fixed-data-table.css!';

/*
 *import Table from '../../build/components/table';
 *import Column from '../../build/components/column';
 */

import { Table, Column } from 'fixed-data-table';

class TableNew extends Table {

}

const data = Array.apply(null, new Array(300)).map((n, idx) => {
  return {
    id: 'item:' + idx,
    name: 'name:' + idx,
    fieldA: 'fieldA:' + idx,
    fieldB: 'fieldB:' + idx
  };
});

export default class App extends Application {
  constructor(props, context) {
    super(props, context);
    this.state =  {
      width: 800,
      height: 600,
      expansions: {}
    };
  }
  render() {

    /*
     *return (
     *  <div>Hello</div>
     *);
     */
    return (
      <div style={{
        position: 'absolute'
      }}>
        <TableNew
          rowGetter={idx => {
            return data[idx];
          }}
          rowsCount={data.length}
          width={this.state.width}
          height={this.state.height}
          headerHeight={34}
          rowHeight={34}
          rowHeightGetter={(idx) => {
            if(this.state.expansions[idx]) {
              return 100;
            }
            return 34;
          }}
          onRowClick={(e, idx, data) => {
            let expansions = this.state.expansions;
            expansions[idx] = !expansions[idx];
            this.setState({
              expansions
            });
          }}
          >
          <Column
            dataKey="id"
            label="ID"
            width={100}
            flexGrow={1}
          />
          <Column
            dataKey="name"
            label="Name"
            width={100}
            flexGrow={1}
            fixed={true}
          />
          <Column
            dataKey="fieldA"
            label="Field A"
            width={100}
            flexGrow={1}
          />
          <Column
            dataKey="fieldB"
            label="Field B"
            width={100}
            flexGrow={1}
          />
        </TableNew>
    </div>
    );
  }
}
