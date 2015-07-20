import React from 'react';
import Component from 'meepworks/component';
import PureRenderComponent from './pure-render-component';

import styles, { transform } from './styles';
import { merge } from 'meepworks/styles';

import Cell from './cell';


export default class Row extends PureRenderComponent {

  _getFixedColumns() {
    let totalWidth = 0;
    let fixedColumns = this.props.fixedColumns.map(c => {
      totalWidth += c.derivedWidth;
      return (
        <Cell
          column={c}
          data={this.props.data}
          height={this.props.height}
          width={c.derivedWidth}
          key={c.dataKey}
        />
      );
    });
    return [
      fixedColumns,
      totalWidth
    ];
  }
  _getScrollableColumns() {
    let totalWidth = 0;
    let scrollableColumns = this.props.scrollableColumns.map(c => {
      totalWidth += c.derivedWidth;
      return (
        <Cell
          column={c}
          data={this.props.data}
          height={this.props.height}
          width={c.derivedWidth}
          key={c.dataKey}
        />
      );
    });
    return [
      scrollableColumns,
      totalWidth
    ];
  }

  render() {
    let [
      fixedColumns,
      fixedWidth
    ] = this._getFixedColumns();


    let [
      scrollableColumns,
      scrollableWidth
    ] = this._getScrollableColumns();

   return (
     <div
       className={this.props.className}
       style={merge(
        styles.row,
        {
          zIndex: this.props.zIndex,
          width: this.props.width,
          height: this.props.height
        },
        transform(
          `translate3d(0px, ${this.props.offsetTop}px, 0px)`
        )
       )}
       onMouseEnter={this.props.onRowMouseEnter}
       onMouseLeave={this.props.onRowMouseLeave}
       onMouseClick={this.props.onRowMouseClick}
       onMouseDoubleClick={this.props.onRowMouseClick}
       onMuseDown={this.props.onRowMouseDown}
       >
       <div
         className="fixed-columns"
         style={merge(
           styles.fixedColumns,
           {
             width: fixedWidth,
             height: this.props.height
           }
         )}
         >
         {fixedColumns}
       </div>
       <div
         className="scrollable-columns"
         style={
           {
             position: 'absolute',
             left: fixedWidth,
             height: this.props.height,
             width: this.props.width - fixedWidth
          }
         }
         >
         <div
           className="scrollable-columns-content"
           style={merge(
          styles.scrollableColumns,
          {
            height: this.props.height,
            width: scrollableWidth
          },
          transform(
            `translate3d(${-this.props.scrollLeft}px, 0px, 0px)`
          )
           )}
           >
            {scrollableColumns}
          </div>
       </div>
    </div>
   );
 }
}

/*
 *
 *          !!!className="meepwork-datatable header"
 *          idx={-1}
 *          !!!zIndex={1}
 *          data={this._getHeaderData(this.state.columns)}
 *          fixedColumns={this.state.fixedColumns}
 *          scrollableColumns={this.state.scrollableColumns}
 *          offsetTop={~~this.state.useGroupHeader*this.props.groupHeaderHeight}
 *          width={this.props.width}
 *          height={this.props.headerHeight}
 *          scrollLeft={this.state.scrollLeft}
 */
