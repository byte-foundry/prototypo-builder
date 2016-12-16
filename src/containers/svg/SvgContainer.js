import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';

import * as Path from '~/_utils/Path';
import * as Parametric from '~/_utils/Parametric';
import * as TwoD from '~/_utils/2D';
import * as Vector from '~/_utils/Vector';
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

import UiToolbar from '../ui/UiToolbar';
import {
  mapDispatchToProps,
  getSvgCoordsFromClientCoords,
} from './_utils';
import SvgRoot from './SvgRoot';

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
    };
  }

  componentWillMount() {
    const { actions, ui, nodes } = this.props;

    window.addEventListener('keyup', (e) => {
      this.setState({...this.state, lastKey: false});
      switch (e.keyCode) {
        case 27: //escape
          actions.setNodeSelected();
          actions.setPathSelected();
          actions.setMouseState(NO_PATH_SELECTED);
          break;
        case 46: //del
          if (ui.uiState === NODE_SELECTED || ui.uiState === NODE_SELECTED_AND_MOVE) {
            const node = nodes[ui.selected.point];
            if (node.type === 'offcurve') {
              const handles = Path.getNode(ui.selected.path, node.id, nodes);
              const vect = Vector.subtract(handles[0], node);
              actions.moveNode(node.id, ui.selected.path, {dx: vect.x, dy: vect.y} );
              actions.setMouseState(PATH_SELECTED);
              actions.setNodeSelected();
            }
          }
          break;
        case 32: //space
          actions.setMouseState(this.state.previousState);
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
          if (ui.uiState !== CAMERA_MODE) {
            this.setState({...this.state, previousState: ui.uiState});
            actions.setCoords(point.x, point.y);
            actions.setMouseState(CAMERA_MODE);
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
    const { actions, ui, nodes } = this.props;

    if (!opts.first) {
      const offcurve1Id = actions.createOffcurve().nodeId;
      if (opts.closed) {
        const path = nodes[pathId];
        const offCurveRef = nodes[path.childIds[1]];

        const offCurveCoord = Vector.subtract(Vector.multiply(coord, 2), offCurveRef);
        actions.updateProp(offcurve1Id, 'x', offCurveCoord.x);
        actions.updateProp(offcurve1Id, 'y', offCurveCoord.y);
      }
      else {
        actions.updateProp(offcurve1Id, 'x', coord.x);
        actions.updateProp(offcurve1Id, 'y', coord.y);
      }
      actions.addOffcurve(pathId, offcurve1Id);
    }

    const oncurveId = actions.createOncurve(ui.baseExpand).nodeId;
    actions.updateProp(oncurveId, 'x', coord.x);
    actions.updateProp(oncurveId, 'y', coord.y);
    actions.addOncurve(pathId, oncurveId);

    if (!opts.closed) {
      const offcurve2Id = actions.createOffcurve().nodeId;
      actions.updateProp(offcurve2Id, 'x', coord.x);
      actions.updateProp(offcurve2Id, 'y', coord.y);
      actions.addOffcurve(pathId, offcurve2Id);
      actions.setNodeSelected(offcurve2Id, pathId);
      actions.setNodeOptionsSelected(offcurve2Id);
    }

    actions.setCoords(coord.x, coord.y);
    actions.setPathSelected(pathId, ui.selected.contour);
    actions.setMouseState(NODE_SELECTED);
  }

  handleDown(e) {
    const { actions, ui, nodes } = this.props;
    const point = getSvgCoordsFromClientCoords({
      x: e.clientX,
      y: e.clientY,
    }, this.refs.svg);

    if (ui.uiState === NO_PATH_SELECTED) {
      const path = Path.findClosestPath(point, ui.selected.contour, nodes);
      if (path) {
        actions.setPathSelected(path, ui.selected.contour);
        actions.setNodeOptionsSelected(path);
        actions.setCoords(point.x, point.y);
        actions.setMouseState(PATH_SELECTED_AND_MOVE);
        actions.setNodeOptionsSelected(path);
      }
      else {
        const pathId = actions.createPath().nodeId;
        actions.addPath( ui.selected.contour, pathId);

        this.createNewAddToPathAndSelect(point, pathId,{
          first: true,
        });
      }
    }
    else if (ui.uiState === PATH_SELECTED) {
      const node = Path.findClosestNode(point, ui.selected.path, nodes);
      const path = nodes[ui.selected.path];
      if (node && node.type === 'node') {
        actions.setCoords(point.x, point.y);
        actions.setNodeSelected(node.point.id, ui.selected.path);
        actions.setNodeOptionsSelected(node.point.id);
        actions.setMouseState(NODE_SELECTED);
      }
      else if (node) {
        // a control is selected
        actions.setCoords(point.x, point.y);
        actions.setNodeSelected(node.baseNode.id, ui.selected.path);
        actions.setNodeOptionsSelected(node.baseNode.id);
        switch (node.type) {
          case 'expandControl':
            actions.setMouseState(CONTROL_EXPAND_SELECTED);
            break;
          case 'distribControl':
            actions.setMouseState(CONTROL_DISTRIB_SELECTED);
            break;
          case 'angleControl':
            actions.setMouseState(CONTROL_ANGLE_SELECTED);
            break;
          default:
            break;
        }
      }
      else if (!path.isClosed){
        this.createNewAddToPathAndSelect(point, ui.selected.path);
      }
    }
    else if (ui.uiState === SELECTION_MODE) {
      actions.setNodeSelected();
      actions.setPathSelected();
      if (ui.hovered.point) {
        actions.setNodeOptionsSelected(ui.hovered.point);
      }
      else if (ui.hovered.path) {
        actions.setNodeOptionsSelected(ui.hovered.path);
      }
    }
  }

  handleMove(e) {
    const { actions, ui, nodes } = this.props;
    const point = getSvgCoordsFromClientCoords({
      x: e.clientX,
      y: e.clientY,
    }, this.refs.svg);

    if (ui.uiState === NODE_SELECTED || ui.uiState === NODE_SELECTED_AND_MOVE) {
      const pointToMove = nodes[ui.selected.point];
      const parentPoint = nodes[ui.selected.parent];
      if (pointToMove) {
        if (pointToMove._isGhost) {
          const move = Vector.subtract(pointToMove._ghost, pointToMove);
          actions.moveNode(pointToMove.id, parentPoint.id, {
            dx: move.x,
            dy: move.y,
          });
          actions.updateProp(pointToMove.id, '_isGhost', false);
        }
        else {
          const move = {
            dx: point.x - ui.mouse.x,
            dy: point.y - ui.mouse.y,
          };
          actions.moveNode(pointToMove.id, parentPoint.id, move);

          if (ui.uiState === NODE_SELECTED) {
            actions.setMouseState(NODE_SELECTED_AND_MOVE);
          }
        }
      }
    }
    if (ui.uiState === CONTROL_EXPAND_SELECTED
        || ui.uiState === CONTROL_DISTRIB_SELECTED
        || ui.uiState === CONTROL_ANGLE_SELECTED) {

      const nodeKeys = Object.keys(nodes);
      const pointIndexKey = nodeKeys.indexOf(ui.selected.point);
      const pointToUpdate = nodes[ui.selected.point];
      const pointOffCurve = nodes[nodeKeys[pointIndexKey - 1]];

      if (pointToUpdate) {
        const move = {
          dx: point.x - ui.mouse.x,
          dy: point.y - ui.mouse.y,
        };
        if (!isNaN(move.dx) && !isNaN(move.dy)) {
          if (ui.uiState === CONTROL_EXPAND_SELECTED) {
            let newExpand = pointToUpdate.expand + move.dy/2;
            if (newExpand > 0) {
              actions.updateProp(pointToUpdate.id, 'expand', newExpand);
            }
          }
          if (ui.uiState === CONTROL_DISTRIB_SELECTED) {
            let newDistrib = pointToUpdate.distrib - (move.dx/100);
            if (newDistrib < 1 && newDistrib > 0) {
              actions.updateProp(pointToUpdate.id, 'distrib', newDistrib);
            }
          }
          if (ui.uiState === CONTROL_ANGLE_SELECTED) {
            if (pointOffCurve) {
              let angle = TwoD.lla(point, pointOffCurve, ui.mouse, pointOffCurve);
              angle = angle * (180/Math.PI);
              let newAngle = pointToUpdate.angle - angle;
              if (newAngle > 0 && newAngle < 360) {
                actions.updateProp(pointToUpdate.id, 'angle', newAngle);
              }
            }
          }
        }
      }
    }
    else {
      if (ui.uiState === PATH_SELECTED) {
        const node = Path.findClosestNode(point, ui.selected.path, nodes);
        if (node) {
          if (node.type === 'node') {
            actions.setNodeHovered(node.point.id, ui.selected.path);
          }
          else {
            actions.setNodeHovered(node.baseNode.id, ui.selected.path);
          }
        }
        else {
          actions.setNodeHovered(undefined, undefined);
        }
      }
      else if (ui.uiState === PATH_SELECTED_AND_MOVE) {
          const move = {
            dx: point.x - ui.mouse.x,
            dy: point.y - ui.mouse.y,
          };
          actions.moveNode(ui.selected.path, ui.selected.contour, move);
      }
      else if (ui.uiState === SELECTION_MODE) {
        let node = undefined;
        let path = undefined;
        let pathHovered = undefined;
        let contour = undefined;
        Object.keys(nodes).forEach((key) => {
          const currentNode = nodes[key];
          if (currentNode.type === 'path') {
            const newNode = Path.findClosestNode(point, currentNode.id, nodes);
            if (newNode && newNode.type === 'node') {
              node = newNode.point.id;
              path = currentNode.id;
            }
          }
          if (currentNode.type === 'contour') {
            const newPath = Path.findClosestPath(point, currentNode.id, nodes);
            if (newPath) {
              pathHovered = newPath;
              contour = currentNode;
            }
          }
        });
        if (node) {
          actions.setNodeHovered(node.id, path);
        }
        else {
          actions.setNodeHovered(undefined, undefined);
        }

        if (pathHovered) {
          actions.setPathHovered(pathHovered, contour);
        }
        else {
          actions.setPathHovered(undefined, undefined);
        }
      }
      else if (ui.uiState === CAMERA_MODE){
        const move = {
          dx: point.x - ui.mouse.x,
          dy: point.y - ui.mouse.y,
        };
        if (!isNaN(move.dx) && !isNaN(move.dy)) {
          this.setState(function (previousState){
            return {
              ...this.state,
              camera: {
                x : previousState.camera.x - move.dx,
                y : previousState.camera.y + move.dy,
                zoom : previousState.camera.zoom,
              },
            };
          });
        }
      }
      else {
        const path = Path.findClosestPath(point, ui.selected.contour, nodes);
        actions.setPathHovered(path, ui.selected.contour);
      }
    }
    actions.setCoords(point.x, point.y);
  }

  handleUp() {
    const { actions, ui, nodes } = this.props;
    if (ui.uiState === NODE_SELECTED || ui.uiState === NODE_SELECTED_AND_MOVE) {
      if (ui.uiState === NODE_SELECTED) {
        const path = nodes[ui.selected.path];
        if (path.childIds.indexOf(ui.selected.point) === 0 && !path.isClosed) {
          const point = nodes[ui.selected.point];
          this.createNewAddToPathAndSelect(point, ui.selected.path, {
            closed: true,
          });
          actions.updateProp(ui.selected.contour, 'isClosed', true);
          actions.updateProp(ui.selected.path, 'isClosed', true);
        }
      }

      actions.setMouseState(PATH_SELECTED);
      actions.setNodeSelected();
    }
    if (ui.uiState === CONTROL_EXPAND_SELECTED
        || ui.uiState === CONTROL_DISTRIB_SELECTED
        || ui.uiState === CONTROL_ANGLE_SELECTED) {
      actions.setMouseState(PATH_SELECTED);
      actions.setNodeSelected();
    }
    else if (ui.uiState === PATH_SELECTED_AND_MOVE) {
      actions.setMouseState(PATH_SELECTED);
    }
  }

  handleDoubleClick(e) {
    e.preventDefault();
    const { actions, ui, nodes } = this.props;
    const point = getSvgCoordsFromClientCoords({
      x: e.clientX,
      y: e.clientY,
    }, this.refs.svg);


    if (ui.uiState === PATH_SELECTED || ui.uiState === NODE_SELECTED) {
      const nodeId = Path.findClosestNode(point, ui.selected.path, nodes);
      const node = nodes[nodeId.point.id];
      if (node) {
        actions.updateProp(nodeId, 'state', node.state === ONCURVE_CORNER ? ONCURVE_SMOOTH : ONCURVE_CORNER);
        if (node.state === ONCURVE_CORNER) {
          const handles = Path.getNode( ui.selected.path, nodeId.id, nodes);
          const newPos = Vector.subtract(Vector.multiply(node, 2), handles[2]);

          actions.updateProp(handles[1].id, 'x', newPos.x);
          actions.updateProp(handles[1].id, 'y', newPos.y);
        }
      }
    }
  }

  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    const { actions } = this.props;
    const reader = new FileReader();
    const extension = e.dataTransfer.files[0].name.split('.')[1];
    reader.onloadend = (data) => {
      if (extension !== 'json') {
        const dataUrl = data.target.result;

        actions.loadImageData(dataUrl);
      }
      else {
        const state = JSON.parse(data.target.result);
        actions.loadNodes(state.nodes, state.formulas);
      }
    };

    if (extension !== 'json') {
      reader.readAsDataURL(e.dataTransfer.files[0]);
    }
    else {
      reader.readAsText(e.dataTransfer.files[0]);
    }
  }

  handleScroll(e) {
    const { ui } = this.props;
    if (ui.uiState === CAMERA_MODE){
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
        };
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
    const { ui } = this.props;
    const viewbox = this.generateViewBox();
    const image = ui.image
      ? <img className="background-image" src={ui.image} onDragStart={(e) => {e.preventDefault();}}/>
      : false;
    const svgContainerStyles = {
      position: 'relative',
      display:'block',
    };
    if (ui.uiState === CAMERA_MODE) {
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
          onDragOver={(e) => {e.preventDefault();}}
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
    nodes: Parametric.getCalculatedGlyph(
      state,
      Parametric.getCalculatedParams(state.nodes.font_initial.params),
      state.ui.selected.glyph
    ),
    ui: state.ui,
  };
}

SvgContainer.propTypes = {
  actions: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(SvgContainer);
