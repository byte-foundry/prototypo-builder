import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import SvgRoot from './SvgRoot';
import UiToolbar from '../ui/UiToolbar';

import {
  getNode,
  getCorrespondingHandles,
} from '~/_utils/path';

import {
  getCalculatedParams,
  getCalculatedGlyph,
} from '~/_utils/parametric';

import {
  mapDispatchToProps,
  getSvgCoordsFromClientCoords,
  getNearPath,
  getNearNode,
  subtractVec,
  multiplyVecByN,
} from './_utils';

import {
  getAngleBetween2Lines,
} from '~/_utils/math'

import {
  NO_PATH_SELECTED,
  NODE_SELECTED,
  NODE_SELECTED_AND_MOVE,
  CONTROL_EXPAND_SELECTED,
  CONTROL_DISTRIB_SELECTED,
  CONTROL_ANGLE_SELECTED,
  PATH_SELECTED,
  PATH_SELECTED_AND_MOVE,
  ONCURVE_CORNER,
  ONCURVE_SMOOTH,
  SELECTION_MODE,
  CAMERA_MODE,
} from '~/const';

class SvgContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.handleDown = this.handleDown.bind(this);
    this.cacheSize = this.cacheSize.bind(this);
    this.state = {
      camera: {
        x: 0,
        y: 0,
        zoom: 1,
      },
      previousState : undefined,
      lastKey : undefined,
    }
  }

  componentWillMount() {
    const {
      setNodeSelected,
      setPathSelected,
      setMouseState,
      moveNode,
    } = this.props.actions;

    window.addEventListener('keyup', (e) => {
      this.setState({...this.state, lastKey: false});
      switch (e.keyCode) {
        case 27: //escape
          setNodeSelected();
          setPathSelected();
          setMouseState(NO_PATH_SELECTED);
          break;
        case 46: //del
          if (this.props.ui.uiState === NODE_SELECTED || this.props.ui.uiState === NODE_SELECTED_AND_MOVE) {
            const node = this.props.nodes[this.props.ui.selected.point];
            if (node.type === 'offcurve') {
              const handles = getCorrespondingHandles(this.props.ui.selected.path, node.id, this.props.nodes);
              const vect = subtractVec(handles[2], node);
              moveNode(node.id, this.props.ui.selected.path, {dx: vect.x, dy: vect.y} );
              setMouseState(PATH_SELECTED);
              setNodeSelected();
            }
          }
          break;
        case 32: //space
          setMouseState(this.state.previousState);
          break;
        default:
          break;
      }
    });
    window.addEventListener('keydown', (e) => {
      if (e.keyCode === this.state.lastKey) {
        return;
      }
      this.setState({...this.state, lastKey: e.keyCode});
      const point = getSvgCoordsFromClientCoords({
        x: e.clientX,
        y: e.clientY,
      }, this.refs.svg);

      switch (e.keyCode) {
        case 32: //space
          if (this.props.ui.uiState !== CAMERA_MODE) {
            this.setState({...this.state, previousState: this.props.ui.uiState});
            this.props.actions.setCoords(point.x, point.y);
            setMouseState(CAMERA_MODE);
          }
          break;
        default:
          break;
      }
    });
    if (!this.knowsSize()) {
      // trigger a render in addition to the initial render so svg's size will
      // be known
      this.forceUpdate();
    }
  }

  createNewAddToPathAndSelect( coord, pathId, opts = {}) {
    if (!opts.first) {
      const offcurve1Id = this.props.actions.createOffcurve().nodeId;
      if (opts.closed) {
        const path = this.props.nodes[pathId];
        const offCurveRef = this.props.nodes[path.childIds[1]];

        const offCurveCoord = subtractVec(multiplyVecByN(coord, 2), offCurveRef);
        this.props.actions.updateProp(offcurve1Id, 'x', offCurveCoord.x);
        this.props.actions.updateProp(offcurve1Id, 'y', offCurveCoord.y);
      }
      else {
        this.props.actions.updateProp(offcurve1Id, 'x', coord.x);
        this.props.actions.updateProp(offcurve1Id, 'y', coord.y);
      }
      this.props.actions.addOffcurve(pathId, offcurve1Id);
    }

    const oncurveId = this.props.actions.createOncurve(this.props.ui.baseExpand).nodeId;
    this.props.actions.updateProp(oncurveId, 'x', coord.x);
    this.props.actions.updateProp(oncurveId, 'y', coord.y);
    this.props.actions.addOncurve(pathId, oncurveId);

    if (!opts.closed) {
      const offcurve2Id = this.props.actions.createOffcurve().nodeId;
      this.props.actions.updateProp(offcurve2Id, 'x', coord.x);
      this.props.actions.updateProp(offcurve2Id, 'y', coord.y);
      this.props.actions.addOffcurve(pathId, offcurve2Id);
      this.props.actions.setNodeSelected(offcurve2Id, pathId);
      this.props.actions.setNodeOptionsSelected(offcurve2Id);
    }

    this.props.actions.setCoords(coord.x, coord.y);
    this.props.actions.setPathSelected(pathId, this.props.ui.selected.contour);
    this.props.actions.setMouseState(NODE_SELECTED);
  }

  handleDown(e) {
    const point = getSvgCoordsFromClientCoords({
      x: e.clientX,
      y: e.clientY,
    }, this.refs.svg);
    if (this.props.ui.uiState === NO_PATH_SELECTED) {
      const path = getNearPath(point, this.props.ui.selected.contour, this.props.nodes);
      if (path) {
        this.props.actions.setPathSelected(path, this.props.ui.selected.contour);
        this.props.actions.setNodeOptionsSelected(path);
        this.props.actions.setCoords(point.x, point.y);
        this.props.actions.setMouseState(PATH_SELECTED_AND_MOVE);
        this.props.actions.setNodeOptionsSelected(path);
      }
      else {
        const pathId = this.props.actions.createPath().nodeId;
        this.props.actions.addPath( this.props.ui.selected.contour, pathId);

        this.createNewAddToPathAndSelect(point, pathId,{
          first: true,
        });
      }
    }
    else if (this.props.ui.uiState === PATH_SELECTED) {
      const node = getNearNode(point, this.props.ui.selected.path, this.props.nodes);
      const path = this.props.nodes[this.props.ui.selected.path];
      if (node && node.type === 'node') {
        this.props.actions.setCoords(point.x, point.y);
        this.props.actions.setNodeSelected(node.point.id, this.props.ui.selected.path);
        this.props.actions.setNodeOptionsSelected(node.point.id);
        this.props.actions.setMouseState(NODE_SELECTED);
      }
      else if (node) {
        // a control is selected
        this.props.actions.setCoords(point.x, point.y);
        this.props.actions.setNodeSelected(node.baseNode.id, this.props.ui.selected.path);
        this.props.actions.setNodeOptionsSelected(node.baseNode.id);
        switch (node.type) {
          case 'expandControl':
            this.props.actions.setMouseState(CONTROL_EXPAND_SELECTED);
            break;
          case 'distribControl':
            this.props.actions.setMouseState(CONTROL_DISTRIB_SELECTED);
            break;
          case 'angleControl':
            this.props.actions.setMouseState(CONTROL_ANGLE_SELECTED);
            break;
          default:
            break;
        }
      }
      else if (!path.isClosed){
        this.createNewAddToPathAndSelect(point, this.props.ui.selected.path);
      }
    }
    else if (this.props.ui.uiState === SELECTION_MODE) {
      this.props.actions.setNodeSelected();
      this.props.actions.setPathSelected();
      if (this.props.ui.hovered.point) {
        this.props.actions.setNodeOptionsSelected(this.props.ui.hovered.point);
      }
      else if (this.props.ui.hovered.path) {
        this.props.actions.setNodeOptionsSelected(this.props.ui.hovered.path);
      }
    }
  }

  handleMove(e) {
    const point = getSvgCoordsFromClientCoords({
      x: e.clientX,
      y: e.clientY,
    }, this.refs.svg);

    if (this.props.ui.uiState === NODE_SELECTED || this.props.ui.uiState === NODE_SELECTED_AND_MOVE) {
      const pointToMove = this.props.nodes[this.props.ui.selected.point];
      const parentPoint = this.props.nodes[this.props.ui.selected.parent];
      if (pointToMove) {
        if (pointToMove._isGhost) {
          const move = subtractVec(pointToMove._ghost, pointToMove);
          this.props.actions.moveNode(pointToMove.id, parentPoint.id, {
            dx: move.x,
            dy: move.y,
          });
          this.props.actions.updateProp(pointToMove.id, '_isGhost', false);
        }
        else {
          const move = {
            dx: point.x - this.props.ui.mouse.x,
            dy: point.y - this.props.ui.mouse.y,
          }
          this.props.actions.moveNode(pointToMove.id, parentPoint.id, move);

          if (this.props.ui.uiState === NODE_SELECTED) {
            this.props.actions.setMouseState(NODE_SELECTED_AND_MOVE);
          }
        }
      }
    }
    if (this.props.ui.uiState === CONTROL_EXPAND_SELECTED
        || this.props.ui.uiState === CONTROL_DISTRIB_SELECTED
        || this.props.ui.uiState === CONTROL_ANGLE_SELECTED) {

      const nodeKeys = Object.keys(this.props.nodes);
      const pointIndexKey = nodeKeys.indexOf(this.props.ui.selected.point);
      const pointToUpdate = this.props.nodes[this.props.ui.selected.point];
      const pointOffCurve = this.props.nodes[nodeKeys[pointIndexKey - 1]];

      if (pointToUpdate) {
        const move = {
          dx: point.x - this.props.ui.mouse.x,
          dy: point.y - this.props.ui.mouse.y,
        }
        if (!isNaN(move.dx) && !isNaN(move.dy)) {
          if (this.props.ui.uiState === CONTROL_EXPAND_SELECTED) {
            let newExpand = pointToUpdate.expand + move.dy/2;
            if (newExpand > 0) {
              this.props.actions.updateProp(pointToUpdate.id, 'expand', newExpand);
            }
          }
          if (this.props.ui.uiState === CONTROL_DISTRIB_SELECTED) {
            let newDistrib = pointToUpdate.distrib - (move.dx/100);
            if (newDistrib < 1 && newDistrib > 0) {
              this.props.actions.updateProp(pointToUpdate.id, 'distrib', newDistrib);
            }
          }
          if (this.props.ui.uiState === CONTROL_ANGLE_SELECTED) {
            if (pointOffCurve) {
              let angle = getAngleBetween2Lines (point, pointOffCurve, this.props.ui.mouse, pointOffCurve);
              angle = angle * (180/Math.PI);
              let newAngle = pointToUpdate.angle - angle;
              if (newAngle > 0 && newAngle < 360) {
                this.props.actions.updateProp(pointToUpdate.id, 'angle', newAngle);
              }
            }
          }
        }
      }
    }
    else {
      if (this.props.ui.uiState === PATH_SELECTED) {
        const node = getNearNode(point, this.props.ui.selected.path, this.props.nodes);
        if (node) {
          if (node.type === 'node') {
            this.props.actions.setNodeHovered(node.point.id, this.props.ui.selected.path);
          }
          else {
            this.props.actions.setNodeHovered(node.baseNode.id, this.props.ui.selected.path);
          }
        }
        else {
          this.props.actions.setNodeHovered(undefined, undefined);
        }
      }
      else if (this.props.ui.uiState === PATH_SELECTED_AND_MOVE) {
          const move = {
            dx: point.x - this.props.ui.mouse.x,
            dy: point.y - this.props.ui.mouse.y,
          }
          this.props.actions.moveNode(this.props.ui.selected.path, this.props.ui.selected.contour, move);
      }
      else if (this.props.ui.uiState === SELECTION_MODE) {
        let node = undefined;
        let path = undefined;
        let pathHovered = undefined;
        let contour = undefined;
        Object.keys(this.props.nodes).forEach((key) => {
          const currentNode = this.props.nodes[key];
          if (currentNode.type === 'path') {
            const newNode = getNearNode(point, currentNode.id, this.props.nodes);
            if (newNode && newNode.type === 'node') {
              node = newNode.point.id;
              path = currentNode.id;
            }
          }
          if (currentNode.type === 'contour') {
            const newPath = getNearPath(point, currentNode.id, this.props.nodes);
            if (newPath) {
              pathHovered = newPath;
              contour = currentNode;
            }
          }
        });
        if (node) {
          this.props.actions.setNodeHovered(node.id, path);
        }
        else {
          this.props.actions.setNodeHovered(undefined, undefined);
        }

        if (pathHovered) {
          this.props.actions.setPathHovered(pathHovered, contour);
        }
        else {
          this.props.actions.setPathHovered(undefined, undefined);
        }
      }
      else if (this.props.ui.uiState === CAMERA_MODE){
        const move = {
          dx: point.x - this.props.ui.mouse.x,
          dy: point.y - this.props.ui.mouse.y,
        }
        if (!isNaN(move.dx) && !isNaN(move.dy)) {
          this.setState(function (previousState){
            return {
              ...this.state,
              camera: {
                x : previousState.camera.x - move.dx,
                y : previousState.camera.y + move.dy,
                zoom : previousState.camera.zoom,
              },
            }
          });
        }
      }
      else {
        const path = getNearPath(point, this.props.ui.selected.contour, this.props.nodes);
        this.props.actions.setPathHovered(path, this.props.ui.selected.contour);
      }
    }
    this.props.actions.setCoords(point.x, point.y);
  }

  handleUp() {
    if (this.props.ui.uiState === NODE_SELECTED || this.props.ui.uiState === NODE_SELECTED_AND_MOVE) {
      if (this.props.ui.uiState === NODE_SELECTED) {
        const path = this.props.nodes[this.props.ui.selected.path];
        if (path.childIds.indexOf(this.props.ui.selected.point) === 0 && !path.isClosed) {
          const point = this.props.nodes[this.props.ui.selected.point];
          this.createNewAddToPathAndSelect(point, this.props.ui.selected.path, {
            closed: true,
          });
          this.props.actions.updateProp(this.props.ui.selected.contour, 'isClosed', true);
          this.props.actions.updateProp(this.props.ui.selected.path, 'isClosed', true);
        }
      }

      this.props.actions.setMouseState(PATH_SELECTED);
      this.props.actions.setNodeSelected();
    }
    if (this.props.ui.uiState === CONTROL_EXPAND_SELECTED
        || this.props.ui.uiState === CONTROL_DISTRIB_SELECTED
        || this.props.ui.uiState === CONTROL_ANGLE_SELECTED) {
      this.props.actions.setMouseState(PATH_SELECTED);
      this.props.actions.setNodeSelected();
    }
    else if (this.props.ui.uiState === PATH_SELECTED_AND_MOVE) {
      this.props.actions.setMouseState(PATH_SELECTED);
    }
  }

  handleDoubleClick(e) {
    e.preventDefault();
    const point = getSvgCoordsFromClientCoords({
      x: e.clientX,
      y: e.clientY,
    }, this.refs.svg);


    if (this.props.ui.uiState === PATH_SELECTED || this.props.ui.uiState === NODE_SELECTED) {
      const nodeId = getNearNode(point, this.props.ui.selected.path, this.props.nodes);
      const node = this.props.nodes[nodeId.point.id];
      if (node) {
        this.props.actions.updateProp(nodeId, 'state', node.state === ONCURVE_CORNER ? ONCURVE_SMOOTH : ONCURVE_CORNER);
        if (node.state === ONCURVE_CORNER) {
          const handles = getNode( this.props.ui.selected.path, nodeId.id, this.props.nodes);
          const newPos = subtractVec(multiplyVecByN(node, 2), handles[2]);

          this.props.actions.updateProp(handles[1].id, 'x', newPos.x);
          this.props.actions.updateProp(handles[1].id, 'y', newPos.y);
        }
      }
    }
  }

  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    const reader = new FileReader();
    const extension = e.dataTransfer.files[0].name.split('.')[1];
    reader.onloadend = (data) => {
      if (extension !== 'json') {
        const dataUrl = data.target.result;

        this.props.actions.loadImageData(dataUrl);
      }
      else {
        const state = JSON.parse(data.target.result);
        this.props.actions.loadNodes(state.nodes, state.formulas);
      }
    }

    if (extension !== 'json') {
      reader.readAsDataURL(e.dataTransfer.files[0]);
    }
    else {
      reader.readAsText(e.dataTransfer.files[0]);
    }
  }

  handleScroll(e){
    if (this.props.ui.uiState === CAMERA_MODE){
      e.persist();
      let newZoom = this.state.camera.zoom - e.deltaY/200;
      if (newZoom <= 0.5) {
        newZoom = 0.5;
      }
      if (newZoom >= 5) {
        newZoom = 5;
      }
      this.setState(function (previousState){
        return {
          ...this.state,
          camera: {
            x : previousState.camera.x,
            y : previousState.camera.y,
            zoom : newZoom,
          },
        }
      });
    }
  }

  cacheSize(svgElement) {
    if (svgElement) {
      var rect = svgElement.getBoundingClientRect();
      this.setSize({
        width: rect.width,
        height: rect.height,
      });
    }
    else {
      this.setSize(null);
    }
  }

  knowsSize() {
    return !!this._size;
  }

  getSize() {
    return this._size;
  }

  setSize(size) {
    this._size = size;
  }

  generateViewBox() {
    if (!this.knowsSize()) {
      return null;
    }

    var size = this.getSize();
    var width = size.width;
    var height = size.height;
    var camera = this.state.camera;

    // camera x/y is its center so translate by half size to get its
    // top/left point because that's what viewbox uses
    var cameraX = camera.x - width / 2;
    var cameraY = camera.y - height / 2;

    var viewBoxWidth = width / camera.zoom;
    var viewBoxHeight = height / camera.zoom;

    var viewBoxX = cameraX - ((viewBoxWidth - width) / 2);
    var viewBoxY = cameraY - ((viewBoxHeight - height) / 2);

    return viewBoxX + ' ' + viewBoxY + ' ' + viewBoxWidth + ' ' + viewBoxHeight;
  }

  render() {
    const viewbox = this.generateViewBox();
    const image = this.props.ui.image
      ? <img className="background-image" src={this.props.ui.image} onDragStart={(e) => {e.preventDefault()}}/>
      : false;
    const svgContainerStyles = {
      position: 'relative',
      display:'block',
    }
    if (this.props.ui.uiState === CAMERA_MODE) {
      svgContainerStyles.cursor = 'move';
    }

    return (
      <div style={{position: 'relative', display:'block'}} className="SvgContainer">
        {image}
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
          onMouseMove={this.handleMove.bind(this)}
          onMouseUp={this.handleUp.bind(this)}
          onDoubleClick={this.handleDoubleClick.bind(this)}
          onDrop={this.handleDrop.bind(this)}
          onDragOver={(e) => {e.preventDefault()}}
          onWheel={this.handleScroll.bind(this)}
          viewBox={viewbox} onMouseDown={this.handleDown}
          ref={this.cacheSize}
          style={svgContainerStyles}
        >
          <g ref="svg" transform="matrix(1 0 0 -1 0 0)">
            <SvgRoot id={'root'} />
          </g>
        </svg>
        <UiToolbar />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    nodes: getCalculatedGlyph(
      state,
      getCalculatedParams(state.nodes.font_initial.params),
      state.ui.selected.glyph
    ),
    ui: state.ui,
  };
}

SvgContainer.propTypes = {
  actions: PropTypes.object.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(SvgContainer);
