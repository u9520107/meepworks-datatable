import Styles from 'meepworks/styles';


export function transform(props) {
  return {
    transform: props,
    WebkitTransform: props
  };
}

export function transition(props) {
  return {
    transition: props,
    WebkitTransition: props.replace(/transform/g, '-webkit-transform')
  };
}

export default new Styles({
  scrollbarX: {
    height: 20,
    position: 'absolute',
    left: 0,
    transition: transition( 'background-color 0.1s 0s linear' )
  },
  scrollerX: {
    backgroundColor: 'gray',
    position: 'absolute',
    top: 4,
    transition: transition( 'opacity 0.1s 0s linear' ),
    height: 12,
    borderRadius: 5,
    opacity: 0.4
  },
  stopperX: {
    position: 'absolute',
    backgroundColor: '#EEEEEE',
    height: 20,
    bottom: 0,
    right: 0,
    opacity: 0,
    transition: transition( 'opacity 0.1s 0s linear' )
  },
  scrollbarY: {
    width: 20,
    position: 'absolute',
    right: 0,
    transition: transition( 'background-color 0.1s 0s linear' )
  },
  scrollerY: {
    backgroundColor: 'gray',
    position: 'absolute',
    left: 4,
    transition: transition( 'opacity 0.1s 0s linear' ),
    width: 12,
    borderRadius: 5,
    opacity: 0.4
  },
  stopperY: {
    position: 'absolute',
    backgroundColor: '#EEEEEE',
    width: 20,
    bottom: 0,
    right: 0,
    opacity: 0,
    transition: transition( 'opacity 0.1s 0s linear' )
  },
  scrollbarHover: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)'
  },
  scrollerHover: {
    opacity: 1
  },
  stopperHover: {
    opacity: 0.7
  },

  row: {
    position: 'absolute'
  },
  cell: {
    position: 'relative',
    display: 'inline-block',
    verticalAlign: 'top'
  },
  fixedColumns: {
    zIndex: 2,
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: 'white'
  },
  scrollableColumns: {
    position: 'absolute',
    whiteSpace: 'nowrap',
    backgroundColor: 'white'
  }


});
