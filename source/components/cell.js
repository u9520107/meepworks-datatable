import React from 'react';
import Component from 'meepworks/component';
import PureRenderComponent from './pure-render-component';
import styles from './styles';
import { merge } from 'meepworks/styles';


export default class Cell extends PureRenderComponent {
  render() {

    let content;

    if(this.props.column.cellRenderer) {
      content = this.props.column.cellRender(this.props.column.dataKey, this.props.data);
    } else {
      content = this.props.data[this.props.column.dataKey]
    }


    return (
      <div
        style={merge(
          styles.cell,
          {
            height: this.props.height,
            width: this.props.width
          }
        )}
        >
        {content}
      </div>
    );
  }
}


/*
 *   column={c}
 *   data={this.props.data}
 *   height={this.props.height}
 *   width=
 *   offset
 */
