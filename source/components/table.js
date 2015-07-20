import React, { PropTypes } from 'react';
import Component from 'meepworks/component';

import Scrollable from './scrollable';
import ScrollX from './scroll-x';
import ScrollY from './scroll-y';

import Column from './column';
import ColumnGroup from './column-group';
import Row from './row';


export default class Table extends Component {
  static get propTypes() {//{{{
    return {

      /**
       * Pixel width of table. If all columns do not fit,
       * a horizontal scrollbar will appear.
       */
      width: PropTypes.number.isRequired,

      /**
       * Pixel height of table. If all rows do not fit,
       * a vertical scrollbar will appear.
       *
       * Either `height` or `maxHeight` must be specified.
       */
      height: PropTypes.number,

      /**
       * Maximum pixel height of table. If all rows do not fit,
       * a vertical scrollbar will appear.
       *
       * Either `height` or `maxHeight` must be specified.
       */
      maxHeight: PropTypes.number,
      minHeight: PropTypes.number,

      //overflowX: PropTypes.oneOf(['hidden', 'auto']),
      //overflowY: PropTypes.oneOf(['hidden', 'auto']),

      /**
       * Number of rows in the table.
       */
      rowsCount: PropTypes.number.isRequired,

      /**
       * Pixel height of rows unless `rowHeightGetter` is specified and returns
       * different value.
       */
      rowHeight: PropTypes.number,

      /**
       * If specified, `rowHeightGetter(index)` is called for each row and the
       * returned value overrides `rowHeight` for particular row.
       */
      rowHeightGetter: PropTypes.func,

      /**
       * To get rows to display in table, `rowGetter(index)`
       * is called. `rowGetter` should be smart enough to handle async
       * fetching of data and return temporary objects
       * while data is being fetched.
       */
      rowGetter: PropTypes.func.isRequired,

      rowExpansionGetter: PropTypes.func,

      /**
       * To get any additional CSS classes that should be added to a row,
       * `rowClassNameGetter(index)` is called.
       */
      rowClassNameGetter: PropTypes.func,

      /**
       * Pixel height of the column group header.
       */
      groupHeaderHeight: PropTypes.number,

      /**
       * Pixel height of header.
       */
      headerHeight: PropTypes.number,

      /**
       * Function that is called to get the data for the header row.
       */
      headerDataGetter: PropTypes.func,

      /**
       * Pixel height of footer.
       */
      footerHeight: PropTypes.number,

      /**
       * Function that is called to get the data for the footer row.
       */
      footerDataGetter: PropTypes.func,

      /**
       * Callback that is called when table is scrolled.
       */
      onScroll: PropTypes.func,

      /**
       * Callback that is called when `rowHeightGetter` returns a different height
       * for a row than the `rowHeight` prop. This is necessary because initially
       * table estimates heights of some parts of the content.
       */
      onContentHeightChange: PropTypes.func,

      /**
       * Callback that is called when a row is clicked.
       */
      onRowClick: PropTypes.func,

      /**
       * Callback that is called when a row is double clicked.
       */
      onRowDoubleClick: PropTypes.func,

      /**
       * Callback that is called when a mouse-down event happens on a row.
       */
      onRowMouseDown: PropTypes.func,

      /**
       * Callback that is called when a mouse-enter event happens on a row.
       */
      onRowMouseEnter: PropTypes.func,

      /**
       * Callback that is called when a mouse-leave event happens on a row.
       */
      onRowMouseLeave: PropTypes.func,

      /**
       * Callback that is called when resizer has been released
       * and column needs to be updated.
       */
      onColumnResizeEndCallback: PropTypes.func
    };
  }
  //}}}
  static get defaultProps() {//{{{
    return {
      footerHeight: 0,
      groupHeaderHeight: 0,
      headerHeight: 0,
      rowHeight: 34
    };
  }
  //}}}

  constructor(props, context) {
    super(props, context);


    this.state = this._calculateState(props);


    this._onDragScrollY = (scrollTop) => {
      this.refs.scrollable.scrollTo(this.state.scrollLeft, scrollTop);
    };
    this._onDragScrollX = (scrollLeft) => {
      this.refs.scrollable.scrollTo(scrollLeft, this.state.scrollTop);
    };


    this._onScroll = (scrollLeft, scrollTop) => {
      let [
        rowBuffer,
        firstRowIndex,
        firstRowOffset,
        bufferedHeight
      ] = this._calculateRowBuffer(scrollTop, this.state.contentContainerHeight, this.props, this.state);
      this.setState({
        scrollLeft,
        scrollTop,
        rowBuffer,
        firstRowIndex,
        firstRowOffset,
        bufferedHeight
      });
    };

  }
  componentWillReceiveProps(nextProps) {

    this.setState(this._calculateState(nextProps, this.state));
  }


  _calculateState(props, oldState) {//{{{

    //column information

    let [
      columns,
      fixedColumns,
      scrollableColumns,
      columnGroups,
      fixedColumnGroups,
      scrollableColumnGroups,
      fixedHeaderColumns,
      scrollableHeaderColumns,
      fixedFooterColumns,
      scrollableFooterColumns,
      useGroupHeader,
      contentWidth
    ] = this._calculateColumnSetting(props, oldState);

    useGroupHeader = useGroupHeader && props.groupHeaderHeight > 0;

    //{{{ heights
    let totalReservedHeight = props.headerHeight + props.footerHeight;

    if(useGroupHeader) {
      totalReservedHeight += propt.groupHeaderHeight;
    }



    let contentHeight = oldState && oldState.contentHeight || props.rowsCount * props.rowHeight;


    let contentContainerHeight = contentHeight;

    if(props.height) {
      contentContainerHeight = Math.max(0, props.height - totalReservedHeight);
    } else {

      contentContainerHeight = contentHeight;

      if(props.minHeight) {
        let minContentContainerHeight = Math.max(0, props.minHeight - totalReservedHeight);
        contentContainerHeight = Math.max(contentContainerHeight, minContentContainerHeight);
      }
      if(props.maxHeight) {
        let maxContentContainerHeight = Math.max(0, props.maxHeight - totalReservedHeight);
        contentContainerHeight = Math.min(contentContainerHeight, maxContentContainerHeight);
      }

    }

    let totalHeight = contentContainerHeight + totalReservedHeight;


    //}}}

    let rowExpansions = oldState ? oldState.rowExpansions : {
      totalHeight: 0,
      expansions: {},
      heights: {}
    };

    let scrollTop = oldState ? oldState.scrollTop : 0;
    let scrollLeft = oldState ? oldState.scrollLeft : 0;

    let [
      rowBuffer,
      firstRowIndex,
      firstRowOffset,
      bufferedHeight
    ] = this._calculateRowBuffer(scrollTop, contentContainerHeight, props, oldState);




    return {
      columns,
      fixedColumns,
      scrollableColumns,
      useGroupHeader,
      columnGroups,
      fixedColumnGroups,
      scrollableColumnGroups,
      fixedHeaderColumns,
      scrollableHeaderColumns,
      fixedFooterColumns,
      scrollableFooterColumns,
      contentHeight,
      contentWidth,
      contentContainerHeight,
      totalReservedHeight,
      totalHeight,
      overflowX: contentWidth > props.width,
      overflowY: contentHeight > contentContainerHeight,
      scrollTop,
      scrollLeft,
      rowBuffer,
      firstRowIndex,
      firstRowOffset,
      bufferedHeight
    };

  }//}}}

  _calculateColumnSetting(props, oldState) { //{{{
    let useGroupHeader = false, fixedColumnPosition = -1;

    let columnData = props.children || [];
    let columns = [];
    let fixedColumns = [];
    let scrollableColumns = [];
    let columnGroups = [];
    let fixedColumnGroups = [];
    let scrollableColumnGroups = [];
    let fixedHeaderColumns = [];
    let scrollableHeaderColumns = [];
    let fixedFooterColumns = [];
    let scrollableFooterColumns = [];

    if(columnData.type === Column || columnData.type === ColumnGroup) {
      columnData = [columnData];
    }

    let totalFlex = 0;
    let baseWidth = 0;
    let contentWidth = 0;

    if(Array.isArray(columnData)) {//{{{

      columnData = columnData.map((c, idx) => {

        if(c.type ===  Column) {

          if(c.props.fixed) {
            if(fixedColumnPosition === -1) {
              fixedColumnPosition = idx;
            } else {
              console.log('multiple fixed column detected');
            }
          }
          totalFlex += c.props.flexGrow;
          baseWidth += c.props.width;

          let res = { type: Column };
          Object.assign(res, c.props);

          return res;

        } else if(c.type === ColumnGroup) {

          useGroupHeader = true;

          if(c.props.fixed) {
            if(fixedColumnPosition === -1) {
              fixedColumnPosition = idx;
            } else {
              console.log('multiple fixed column detected');
            }
          }

          let child = c.props.children;
          let nestedColumns;

          if(child.type === Column) {
            totalFlex += c.props.flexGrow;
            baseWidth += c.props.width;

            let res = {
              type: Column
            };
            Object.assign(res, child.props);
            nestedColumns = [
              res
            ];
          } else if(Array.isArray(child)) {
            nestedColumns = child.map(cd => {
              if(cd.type === Column) {
                totalFlex += cd.props.flexGrow;
                baseWidth += cd.props.width;

                let res = {
                  type: Column
                };

                Object.assign(res, cd.props);
                return res;
              } else {
                throw new Error('ColumnGroup can only contain Columns');
              }
            });
          } else {
            throw new Error('ColumnGroup must contain one or more Columns');
          }
          let res = {
            type: ColumnGroup
          };
          Object.assign(res, c.props, {
            children: nestedColumns
          });
          return res;
        } else {
          throw new Error('ListView can only contain Columns or ColumnGroups');
        }
      });
    } else {
      columnData = [];
    }
    //}}}

    //{{{ column width calculation
    let flexUnitWidth = totalFlex && Math.max(0, props.width - baseWidth)/totalFlex;

    columnData.forEach((c, idx) => {
      if(c.type === Column) {
        c.derivedWidth = c.width + c.flexGrow * flexUnitWidth;
        contentWidth += c.derivedWidth;

        columns.push(c);

        if(idx > fixedColumnPosition) {
          scrollableColumns.push(c);
          scrollableHeaderColumns.push(this._createHeaderColumn(c));
          scrollableFooterColumns.push(this._createFooterColumn(c));
        } else {
          fixedColumns.push(c);
          fixedHeaderColumns.push(this._createHeaderColumn(c));
          fixedFooterColumns.push(this._createFooterColumn(c));
        }
      } else {
        let groupWidth = 0;
        c.children.forEach(child => {
          child.derivedWidth = child.width + child.flexGrow * flexUnitWidth;
          groupWidth += child.derivedWidth;

          columns.push(child);
          if(idx > fixedColumnPosition) {
            scrollableColumns.push(child);
            scrollableHeaderColumns.push(this._createHeaderColumn(child));
            scrollableFooterColumns.push(this._createFooterColumn(child));
          } else {
            fixedColumns.push(child);
            fixedHeaderColumns.push(this._createHeaderColumn(child));
            fixedFooterColumns.push(this._createFooterColumn(child));
          }
        });
        c.derivedWith = groupWidth;

        //use the position of the columnGroup relative to columnGroups as dataKey
        c.dataKey = columnGroups.length;
        columnGroups.push(c);
        if(idx > fixedColumnPosition) {
          scrollableColumnGroups.push(c);
        } else {
          fixedColumnGroups.push(c);
        }

      }
    });
    //}}}

    return [
      columns,
      fixedColumns,
      scrollableColumns,
      columnGroups,
      fixedColumnGroups,
      scrollableColumnGroups,
      fixedHeaderColumns,
      scrollableHeaderColumns,
      fixedFooterColumns,
      scrollableFooterColumns,
      useGroupHeader,
      contentWidth
    ];
  }
  //}}}

  _createHeaderColumn(column) {//{{{
    let res = {};
    Object.assign(res, column);
    res.cellRenderer = res.headerRenderer;
    return res;
  }//}}}
  _createFooterColumn(column) {//{{{
    let res = {};
    Object.assign(res, column);
    res.cellRenderer = res.footerRenderer;
    return res;
  }//}}}

  _getGroupHeaderData(columnGroups) {//{{{
    let groupHeaderData = {};
    columnGroups.forEach((cg, idx) => {
      groupHeaderData[idx] = cg.label || '';
    });
    return groupHeaderData;
  }//}}}
  _getHeaderData(columns) {//{{{
    let data = {};
    columns.forEach(c => {
      if(this.props.headerDataGetter) {
        data[c.dataKey] = this.props.headerDataGetter(c.dataKey);
      } else {
        data[c.dataKey] = c.label || '';
      }
    });
    return data;
  }//}}}

  _renderRows(headerOffset) {//{{{




    return this.state.rowBuffer.map((r ,idx) => {
      return (
        <Row
          key={idx}
          className="meepworks-datable row"
          idx={r.idx}
          zIndex={0}
          offsetTop={r.offset + headerOffset - this.state.scrollTop}
          data={this.props.rowGetter(r.idx)}
          fixedColumns={this.state.fixedColumns}
          scrollableColumns={this.state.scrollableColumns}
          width={this.props.width}
          height={r.rowHeight}
          scrollLeft={this.state.scrollLeft}
        />
      );

  });



  }//}}}

  _getRowHeight(idx, props) {
    return props.rowHeightGetter ? props.rowHeightGetter(idx) : props.rowHeight;
  }
  _calculateRowBuffer(scrollTop, contentContainerHeight, props, oldState) {

    let minBuffer = Math.max(10, Math.ceil(contentContainerHeight/props.rowHeight));
    let bufferCount = 3 * minBuffer;

    let firstRowIndex, firstRowOffset, rowBuffer, bufferedHeight;

    if(oldState) {
      firstRowIndex = oldState.firstRowIndex;
      firstRowOffset = oldState.firstRowOffset;
      bufferedHeight = oldState.bufferedHeight;
      rowBuffer = oldState.rowBuffer;



    } else {
      firstRowIndex = 0;
      firstRowOffset = 0;
      bufferedHeight = 0;
      rowBuffer = [];

      let idx = 0;
      let offset = 0;
      while(idx < bufferCount && idx < props.rowsCount) {
        let rowHeight = this._getRowHeight(idx, props);
        rowBuffer.push({
          idx,
          rowHeight,
          offset
        });

        offset += rowHeight;
        idx++;
      }
      bufferedHeight = offset;

    }





    return [
      rowBuffer,
      firstRowIndex,
      firstRowOffset,
      bufferedHeight
    ];


  }

  render() {


    let groupHeader;

    let groupHeaderHeight = ~~this.state.useGroupHeader*this.props.groupHeaderHeight;
    if(this.state.useGroupHeader) {
      groupHeader = (
        <Row
          key="group-header"
          className="meepworks-datatable group-header"
          idx={-1}
          zIndex={1}
          offsetTop={0}
          data={this._getGroupHeaderData(this.state.columnGroups)}
          fixedColumns={this.state.fixedColumnGroups}
          scrollableColumns={this.state.scrollableColumnGroups}
          width={this.props.width}
          height={groupHeaderHeight}
          scrollLeft={this.state.scrollLeft}
        />
      );
    }

    let header;
    if(this.props.headerHeight > 0) {
      header = (
        <Row
          key="header"
          className="meepwork-datatable header"
          idx={-1}
          zIndex={1}
          data={this._getHeaderData(this.state.columns)}
          fixedColumns={this.state.fixedHeaderColumns}
          scrollableColumns={this.state.scrollableHeaderColumns}
          offsetTop={groupHeaderHeight}
          width={this.props.width}
          height={this.props.headerHeight}
          scrollLeft={this.state.scrollLeft}
        />
      );
    }

    let scrollY;
    if(this.state.overflowY) {
      scrollY = (
        <ScrollY
          height={this.state.contentContainerHeight}
          viewportHeight={this.state.contentContainerHeight}
          contentHeight={this.state.contentHeight}
          scrollTop={this.state.scrollTop}
          top={groupHeaderHeight + this.props.headerHeight}
          paddingBottom={~~this.state.overflowX*20}
          onDragScroll={this._onDragScrollY}
        />
      );
    }

    let scrollX;
    if(this.state.overflowX) {
      scrollX = (
        <ScrollX
          width={this.props.width}
          viewportWidth={this.props.width}
          contentWidth={this.state.contentWidth}
          scrollLeft={this.state.scrollLeft}
          bottom={this.props.footerHeight}
          paddingRight={~~this.state.overflowY*20}
          onDragScroll={this._onDragScrollX}
        />
      );
    }


    let rows = this._renderRows(groupHeaderHeight + this.props.headerHeight);

    //footer
    let footer;

    return (
      <Scrollable
        ref="scrollable"
        width={this.props.width}
        contentWidth={this.state.contentWidth}
        height={this.state.totalHeight}
        contentHeight={this.state.contentHeight}
        scrollXHeight={0}
        scrollYWidth={0}
        onScroll={this._onScroll}
        >
        {groupHeader}
        {header}
        {rows}
        {scrollY}
        {scrollX}
        {footer}
      </Scrollable>
    );
  }
}
