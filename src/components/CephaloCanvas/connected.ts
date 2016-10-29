import {
  connect,
  MapStateToProps,
  MapDispatchToPropsFunction,
  MergeProps,
} from 'react-redux';
import CephaloCanvas from './index';
import {
  ConnectableProps,
  StateProps,
  DispatchProps,
  AdditionalPropsToMerge,
} from './props';
import {
  getImageSize,
  getImageData,
  getImageBrightness,
  getImageContrast,
  isImageFlippedX,
  isImageFlippedY,
  isImageInverted,
} from 'store/reducers/workspace/image';
import {
  getCanvasSize,
  getScale,
  getScaleOrigin,
  getAllLandmarks,
  getHighlightedLandmarks,
  createActiveTool,
} from 'store/reducers/workspace/canvas';
import assign from 'lodash/assign';
import partial from 'lodash/partial';

type OwnProps = { };

const mapStateToProps: MapStateToProps<StateProps, OwnProps> = (enhancedState: EnhancedState<StoreState>) => {
  const state = enhancedState.present;
  const origin = getScaleOrigin(state);
  const { height: canvasHeight, width: canvasWidth } = getCanvasSize(state);
  const { height: imageHeight, width: imageWidth } = getImageSize(state);
  return {
    canvasHeight, 
    canvasWidth,
    src: getImageData(state),
    imageWidth,
    imageHeight,
    scale: getScale(state),
    scaleOriginX: origin === null ? '50%' : origin.x,
    scaleOriginY: origin === null ? '50%' : origin.y,
    brightness: getImageBrightness(state),
    contrast: getImageContrast(state),
    isFlippedX: isImageFlippedX(state),
    isFlippedY: isImageFlippedY(state),
    landmarks: getAllLandmarks(state),
    isInverted: isImageInverted(state),
    isHighlightModeActive: true,
    highlightedLandmarks: getHighlightedLandmarks(state),
    activeTool: partial(createActiveTool, state),
  };
};

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, OwnProps> = (dispatch) => ({ dispatch });

const mergeProps: MergeProps<StateProps, DispatchProps, OwnProps> = (stateProps, dispatchProps): ConnectableProps => {
  return assign(
    { },
    stateProps,
    dispatchProps,
    stateProps.activeTool(dispatchProps.dispatch) as AdditionalPropsToMerge,
  );
};

const connected = connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps, mapDispatchToProps, mergeProps
)(CephaloCanvas);


export default connected;