import React, { PropTypes }from 'react';
import PureRenderComponent from './pure-render-component';
import { merge } from 'meepworks/styles';
import styles, { transform } from './styles';


export default class ScrollX extends PureRenderComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      hover: false,
      dragging: false,
      scrollerWidth: Math.max(this.props.viewportWidth*( this.props.width - this.props.paddingRight)/this.props.contentWidth, 10)
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
    let pos = Math.max(e.pageX - React.findDOMNode(this).getBoundingClientRect().left - this.state.scrollerWidth/2, 0);
    let left = Math.min(pos*this.props.contentWidth/(this.props.width - this.props.paddingRight), this.props.contentWidth - this.props.viewportWidth);
    if(this.props.onDragScroll) {
      this.props.onDragScroll(left);
    }
  }
  componentDidMount() {
    document.querySelector('body').addEventListener('mousemove', this.onMouseMove);
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.width !== this.props.width ||
       nextProps.contentWidth !== this.props.contentWidth ||
         nextProps.viewportWidth !== this.props.viewportWidth ) {
      this.setState({
        scrollerWidth: Math.max(nextProps.viewportWidth*(nextProps.width - nextProps.paddingRight)/nextProps.contentWidth, 10)
      });
    }
  }
  static get propTypes() {
    return {
      width: PropTypes.number.isRequired,
      contentWidth: PropTypes.number.isRequired,
      viewportWidth: PropTypes.number.isRequired,
      scrollLeft: PropTypes.number.isRequired,
      paddingRight: PropTypes.number
    };
  }
  static get defaultProps() {
    return {
      paddingRight: 0
    };
  }
  render() {
    return (
      <div
        style={merge(
          styles.scrollbarX,
          {
            width: this.props.width,
            bottom: this.props.bottom
          },
          this.state.hover && styles.scrollbarHover
        )}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onMouseDown={this.onMouseDown}
        >
        <div style={merge(
          styles.scrollerX,
          {
            width: this.state.scrollerWidth
          },
          transform(
            'translate3d(' +
              this.props.scrollLeft*(this.props.width - this.props.paddingRight)/this.props.contentWidth +
              'px, 0px, 0px)'
          ),
          this.state.hover && styles.scrollerHover
        )}/>
      {
        this.props.paddingRight > 0 && (
          <div style={merge(
            styles.stopperX,
            {
              width: this.props.paddingRight
            },
            this.state.hover && styles.stopperHover
          )}/>
        )
      }
    </div>
    );
  }
}
