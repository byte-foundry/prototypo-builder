import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import SvgRoot from './SvgRoot';
import UiToolbar from '../ui/UiToolbar';
import NodeProperties from '../text/NodeProperties';

import {
  getNode,
  getCorrespondingHandles
} from '~/_utils/path';

import {
  getCalculatedParams,
  getCalculatedGlyph
} from './../_utils';

import {
  mapDispatchToProps,
  getSvgCoordsFromClientCoords,
  getNearPath,
  getNearNode,
  subtractVec,
  multiplyVecByN,
  outline
} from './_utils';

import {
  NO_PATH_SELECTED,
  NODE_SELECTED,
  NODE_SELECTED_AND_MOVE,
  PATH_SELECTED,
  PATH_SELECTED_AND_MOVE,
  ONCURVE_CORNER,
  ONCURVE_SMOOTH,
  SELECTION_MODE
} from '../../actions/const';

class SvgContainer extends Component {
  constructor(props) {
    super(props);
    this.handleDown = this.handleDown.bind(this);
  }

  componentWillMount() {
    window.addEventListener('keyup', (e) => {
      if (e.keyCode === 27) {
        this.props.actions.setNodeSelected();
        this.props.actions.setPathSelected();
        this.props.actions.setMouseState(NO_PATH_SELECTED);
      }
      else if (e.keyCode === 46) {
        if (this.props.ui.uiState === NODE_SELECTED || this.props.ui.uiState === NODE_SELECTED_AND_MOVE) {
          const node = this.props.nodes[this.props.ui.selected.point];
          if (node.type === 'offcurve') {
            const handles = getCorrespondingHandles(this.props.ui.selected.path, node.id, this.props.nodes);
            const vect = subtractVec(handles[2], node);
            this.props.actions.moveNode(node.id, this.props.ui.selected.path, {dx: vect.x, dy: vect.y} );
            this.props.actions.setMouseState(PATH_SELECTED);
            this.props.actions.setNodeSelected();
          }
        }
      }
    });
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

    const oncurveId = this.props.actions.createOncurve().nodeId;
    this.props.actions.updateProp(oncurveId, 'x', coord.x);
    this.props.actions.updateProp(oncurveId, 'y', coord.y);
    this.props.actions.addOncurve(pathId, oncurveId);

    if (!opts.closed) {
      const offcurve2Id = this.props.actions.createOffcurve().nodeId;
      this.props.actions.updateProp(offcurve2Id, 'x', coord.x);
      this.props.actions.updateProp(offcurve2Id, 'y', coord.y);
      this.props.actions.addOffcurve(pathId, offcurve2Id);
      this.props.actions.setNodeSelected(offcurve2Id, pathId);
    }

    this.props.actions.setCoords(coord.x, coord.y);
    this.props.actions.setPathSelected(pathId, this.props.ui.selected.contour);
    this.props.actions.setMouseState(NODE_SELECTED);
  }

  handleDown(e) {
    const point = getSvgCoordsFromClientCoords({
      x: e.clientX,
      y: e.clientY
    }, this.refs.svg);
    if (this.props.ui.uiState === NO_PATH_SELECTED) {
      const path = getNearPath(point, this.props.ui.selected.contour, this.props.nodes);
      if (path) {
        this.props.actions.setPathSelected(path, this.props.ui.selected.contour);
        this.props.actions.setCoords(point.x, point.y);
        this.props.actions.setMouseState(PATH_SELECTED_AND_MOVE);
      } else {
        const pathId = this.props.actions.createPath().nodeId;
        this.props.actions.addPath( this.props.ui.selected.contour, pathId);

        this.createNewAddToPathAndSelect(point, pathId,{
          first: true
        });
      }
    }
    else if (this.props.ui.uiState === PATH_SELECTED) {
      const node = getNearNode(point, this.props.ui.selected.path, this.props.nodes);
      const path = this.props.nodes[this.props.ui.selected.path];
      if (node) {
        this.props.actions.setCoords(point.x, point.y);
        this.props.actions.setNodeSelected(node, this.props.ui.selected.path);
        this.props.actions.setMouseState(NODE_SELECTED);
      } else if (!path.isClosed){
        this.createNewAddToPathAndSelect(point, this.props.ui.selected.path);
      }
    }
    else if (this.props.ui.uiState === SELECTION_MODE) {
      this.props.actions.setNodeSelected();
      this.props.actions.setPathSelected();
      if (this.props.ui.hovered.point) {
        this.props.actions.setNodeSelected(this.props.ui.hovered.point);
      }
      else if (this.props.ui.hovered.path) {
        this.props.actions.setPathSelected(this.props.ui.hovered.path);
      }
    }
  }

  handleMove(e) {
    const point = getSvgCoordsFromClientCoords({
      x: e.clientX,
      y: e.clientY
    }, this.refs.svg);

    if (this.props.ui.uiState === NODE_SELECTED || this.props.ui.uiState === NODE_SELECTED_AND_MOVE) {
      const pointToMove = this.props.nodes[this.props.ui.selected.point];
      const parentPoint = this.props.nodes[this.props.ui.selected.parent];
      if (pointToMove) {
        if (pointToMove._isGhost) {
          const move = subtractVec(pointToMove._ghost, pointToMove);
          this.props.actions.moveNode(pointToMove.id, parentPoint.id, {
            dx: move.x,
            dy: move.y
          });
          this.props.actions.updateProp(pointToMove.id, '_isGhost', false);
        } else {
          const move = {
            dx: point.x - this.props.ui.mouse.x,
            dy: point.y - this.props.ui.mouse.y
          }
          this.props.actions.moveNode(pointToMove.id, parentPoint.id, move);

          if (this.props.ui.uiState === NODE_SELECTED) {
            this.props.actions.setMouseState(NODE_SELECTED_AND_MOVE);
          }
        }
      }
    } else {
      if (this.props.ui.uiState === PATH_SELECTED) {
        const node = getNearNode(point, this.props.ui.selected.path, this.props.nodes);
        if (node) {
          this.props.actions.setNodeHovered(node, this.props.ui.selected.path);
        } else {
          this.props.actions.setNodeHovered(undefined, undefined);
        }
      }
      else if (this.props.ui.uiState === PATH_SELECTED_AND_MOVE) {
          const move = {
            dx: point.x - this.props.ui.mouse.x,
            dy: point.y - this.props.ui.mouse.y
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
            if (newNode) {
              node = newNode;
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
          this.props.actions.setNodeHovered(node, path);
        } else {
          this.props.actions.setNodeHovered(undefined, undefined);
        }

        if (pathHovered) {
          this.props.actions.setPathHovered(pathHovered, contour);
        } else {
          this.props.actions.setPathHovered(undefined, undefined);
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
            closed: true
          });
          this.props.actions.updateProp(this.props.ui.selected.contour, 'isClosed', true);
          this.props.actions.updateProp(this.props.ui.selected.path, 'isClosed', true);
        }
      }

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
      y: e.clientY
    }, this.refs.svg);


    if (this.props.ui.uiState === PATH_SELECTED || this.props.ui.uiState === NODE_SELECTED) {
      const nodeId = getNearNode(point, this.props.ui.selected.path, this.props.nodes);
      const node = this.props.nodes[nodeId];
      if (node) {
        this.props.actions.updateProp(nodeId, 'state', node.state === ONCURVE_CORNER ? ONCURVE_SMOOTH : ONCURVE_CORNER);
        if (node.state === ONCURVE_CORNER) {
          const handles = getNode( this.props.ui.selected.path, nodeId, this.props.nodes);
          const newPos = subtractVec(multiplyVecByN(node, 2), handles[2]);

          this.props.actions.updateProp(handles[1].id, 'x', newPos.x);
          this.props.actions.updateProp(handles[1].id, 'y', newPos.y);
        }
      }
    }
  }

  render() {
    let nodeSelected = false;
    if (this.props.ui.uiState === SELECTION_MODE) {
      if (this.props.ui.selected.point) {
        const {id, type} = this.props.nodes[this.props.ui.selected.point];
        nodeSelected = (
          <div className="floating-prop">
            <NodeProperties id={id} type={type} />
          </div>
        );
      }
      else if (this.props.ui.selected.path) {
      }
    }
    return (
      <div style={{position: 'relative'}}>
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
          onMouseMove={this.handleMove.bind(this)}
          onMouseUp={this.handleUp.bind(this)}
          onDoubleClick={this.handleDoubleClick.bind(this)}
          viewBox="-800 -1400 2000 2000" onMouseDown={this.handleDown}
        >
          <g ref="svg" transform="matrix(1 0 0 -1 0 0)">
            <SvgRoot id={'root'} />
          </g>
        </svg>
        <UiToolbar />
        {nodeSelected}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    nodes: getCalculatedGlyph(
      state,
      getCalculatedParams(state, null, 'font_initial'),
      state.ui.selected.glyph
    ),
    ui: state.ui
  };
}

SvgContainer.propTypes = {
  actions: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(SvgContainer);
