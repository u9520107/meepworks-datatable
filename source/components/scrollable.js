import React, { PropTypes } from 'react';
import Scroller from 'zynga-scroller';
import Component from 'meepworks/component';

const EffectiveProps = [
  'width',
  'height',
  'contentHeight',
  'contentWidth',
  'scrollYWidth',
  'scrollXHeight'
];
export default class Scrollable extends Component {
  constructor(props, context) {
    super(props, context);


    let self = this;
    self.onTouchStart = function (e) {
      if(self.state.scroller) {
        self.state.scroller.doTouchStart(e.touches, e.timeStamp);
      }
      e.preventDefault();
    };
    self.onTouchMove = function (e) {
      if(self.state.scroller) {
        self.state.scroller.doTouchMove(e.touches, e.timeStamp);
      }
      e.preventDefault();
    };
    self.onTouchEnd = function (e) {
      if(self.state.scroller) {
        self.state.scroller.doTouchEnd(e.timeStamp);
      }
      e.preventDefault();
    };
    self.onWheel = function (e) {
      if(self.state.scroller) {
        self.state.scroller.scrollBy(e.deltaX, e.deltaY);
      }
      e.preventDefault();
    };


    this.state =  this.calculateState(props);


  }

  static get propTypes() {
    return {
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      contentHeight: PropTypes.number.isRequired,
      contentWidth: PropTypes.number.isRequired,
      scrollYWidth: PropTypes.number.isRequired,
      scrollXHeight: PropTypes.number.isRequired,
      onScroll: PropTypes.func.isRequired
    }
  }
  componentDidMount() {
    let scroller = new Scroller(this.props.onScroll);
    this.setState({
      scroller: scroller,
      check: true
    });
    scroller.setDimensions(this.state.viewportWidth, this.state.viewportHeight, this.props.contentWidth, this.props.contentHeight);
  }
  componentWillReceiveProps(nextProps) {
    for(let key of EffectiveProps) {
      if(nextProps[key] !== this.props[key]) {
        let state = this.calculateState(nextProps);
        if(this.state.scroller) {
          this.state.scroller.setDimensions(state.viewportWidth, state.viewportHeight, nextProps.contentWidth, nextProps.contentHeight);
        }
        this.setState(state);
      }
    }
  }
  scrollTo(left, top) {
    if(this.state.scroller) {
      this.state.scroller.scrollTo(left, top);
    }
  }
  calculateState(props) {
    let overflowX = props.contentWidth > props.width;
    let overflowY = props.contentHeight > props.height;
    let viewportWidth = props.width;
    let viewportHeight = props.height;

    if(!overflowX && overflowY) {
      overflowX = props.contentWidth > (props.width - props.scrollYWidth);
    }
    if(!overflowY && overflowX) {
      overflowY = props.contentHeight > (props.width - props.scrollXHeight);
    }

    if(overflowX) {
      viewportWidth -= props.scrollYWidth;
    }
    if(overflowY) {
      viewportHeight -= props.scrollXHeight;
    }

    return {
      overflowX,
      overflowY,
      viewportWidth,
      viewportHeight
    };

  }
  render() {


    return (
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          width: this.props.width,
          height: this.props.height
        }}
        onTouchStart={ this.onTouchStart }
        onTouchMove={ this.onTouchMove }
        onTouchEnd={ this.onTouchEnd }
        onWheel={this.onWheel}
        >
        { this.props.children }
      </div>
    );
  }
}

