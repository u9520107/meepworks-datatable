import React from 'react';
import Application from 'meepworks/application';

import 'normalize.css/normalize.css!';

import Table from '../../build/components/table';
import Column from '../../build/components/column';


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
      height: 600
    };
  }
  render() {
    return (
      <div style={{
        position: 'absolute'
      }}>
      <div key="params" >
        height:<input key="height" value={this.state.height} onChange={(e) => {
          this.setState({
            height: parseInt(e.currentTarget.value)
          });
        }}/> <br />
      width: <input key="width" value={this.state.width} onChange={e => {
        this.setState({
          width: parseInt(e.currentTarget.value)
        });
      }}/>
        </div>
        <div
          key="table"
          style={{
            border: '1px solid lightgray',
            position: 'absolute'
        }}>
        <Table
          rowGetter={idx => {
            return data[idx];
          }}
          rowsCount={data.length}
          width={this.state.width}
          height={this.state.height}
          headerHeight={34}
          >
          <Column
            dataKey="id"
            label="ID"
          />
          <Column
            dataKey="name"
            label="Name"
            fixed={true}
          />
          <Column
            dataKey="fieldA"
            label="Field A"
          />
          <Column
            dataKey="fieldB"
            label="Field B"
          />
        </Table>
      </div>
    </div>
    );
  }
}
