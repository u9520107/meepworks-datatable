import React from 'react';
import Component from 'meepworks/component';

export default class PureRenderComponent extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    for(let key in nextProps) {
      if(this.props[key] !== nextProps[key]) {
        return true;
      }
    }
    for(let key in nextState) {
      if(this.state[key] !== nextState[key]) {
        return true;
      }
    }
    return false;
  }
  render() {
    return null;
  }
}
