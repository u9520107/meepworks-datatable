import React, { PropTypes }from 'react';
import PureRenderComponent from './pure-render-component';
import { merge } from 'meepworks/styles';
import styles, { transform } from './styles';

export default class ScrollY extends PureRenderComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      hover: false,
      dragging: false,
      scrollerHeight: Math.max(this.props.viewportHeight*( this.props.height - this.props.paddingBottom )/this.props.contentHeight, 20)
    };

    this.onMouseEnter = (e) => {
      this.setState({
        hover: true
      });
    };
    this.onMouseDown = (e) => {
      e.preventDefault();
      this.calculateDragPosition(e);
      this.setState({
        dragging: true
      });
    };
    this.onMouseMove = (e) => {
      if(this.state.dragging) {
        if(e.buttons > 0) {
          this.calculateDragPosition(e);
        } else {
          this.setState({
            dragging: false
          });
        }
      }
    };
    this.onMouseLeave = (e) => {
      this.setState({
        hover: false
      });
    };

  }
  calculateDragPosition(e) {
    let pos = Math.max(e.pageY - React.findDOMNode(this).getBoundingClientRect().top - this.state.scrollerHeight/2, 0);
    let top = Math.min(pos*this.props.contentHeight/( this.props.height - this.props.paddingBottom ), this.props.contentHeight - this.props.viewportHeight);
    if(this.props.onDragScroll) {
      this.props.onDragScroll(top);
    }
  }
  componentDidMount() {
    document.querySelector('body').addEventListener('mousemove', this.onMouseMove);
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.height !== this.props.height ||
       nextProps.contentHeight !== this.props.contentHeight ||
         nextProps.viewportHeight !== this.props.viewportHeight ) {
      this.setState({
        scrollerHeight: Math.max(nextProps.viewportHeight*( nextProps.height - nextProps.paddingBottom )/nextProps.contentHeight, 20)
      });
    }
  }
  static get propTypes() {
    return {
      height: PropTypes.number.isRequired,
      contentHeight: PropTypes.number.isRequired,
      viewportHeight: PropTypes.number.isRequired,
      scrollTop: PropTypes.number.isRequired,
      paddingBottom: PropTypes.number
    };
  }
  static get defaultProps() {
    return {
      paddingBottom: 0
    };
  }
  render() {
    return (
      <div
        style={merge(
          styles.scrollbarY,
          {
            height: this.props.height,
            top: this.props.top
          },
          this.state.hover && styles.scrollbarHover
        )}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onMouseDown={this.onMouseDown}
        >
        <div style={merge(
          styles.scrollerY,
          {
            height: this.state.scrollerHeight
          },
          transform(
            'translate3d(0px, ' +
              this.props.scrollTop*( this.props.height - this.props.paddingBottom )/this.props.contentHeight +
              'px, 0px)'
          ),
          this.state.hover && styles.scrollerHover
          )}
        />
        {
          this.props.paddingBottom > 0 && (
            <div style={merge(
              styles.stopperY,
              {
                height: this.props.paddingBottom
              },
              this.state.hover && styles.stopperHover
            )}/>
          )
        }
      </div>
    );
  }
}
