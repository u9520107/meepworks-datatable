import React, { PropTypes } from 'react';
import Component from 'meepworks/component';

export default class ColumnGroup extends Component {
  static get propTypes() {
    return {
      align: PropTypes.oneOf(['left', 'center', 'right']),
      label: PropTypes.string,
      fixed: PropTypes.bool,
      columnGroupData: PropTypes.object,
      /**
       * The cell renderer that returns React-renderable content for a table
       * column group header. If it's not specified, the label from props will
       * be rendered as header content.
       * ```
       * function(
       *   label: ?string,
       *   cellDataKey: string,
       *   columnGroupData: any,
       *   rowData: array<?object>, // array of labels of all coludmnGroups
       *   width: number
       * ): ?$jsx
       * ```
       */
      groupHeaderRenderer: PropTypes.func,
    };
  }
  static get defaultProps() {
    return  {
      fixed: false
    };
  }
  render() {
    return null;
  }
}
