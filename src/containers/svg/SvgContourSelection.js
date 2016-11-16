require('styles/svg/Selection.scss');

import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { forEachNode } from '../../_utils/path';
import SvgSelector from './SvgSelector';
import SvgNodeControls from './SvgNodeControls';

import {
  PATH_SELECTED,
  SELECTION_MODE,
} from '~/const';

import {
  getParentGlyphId,
} from '~/_utils/graph';

import {
  getCalculatedParams,
  getCalculatedGlyph,
} from '~/_utils/parametric';

import {
  mapDispatchToProps,
  getPathBbox,
} from './_utils';



class SvgContourSelection extends PureComponent {
  constructor(props) {
    super(props);
    this.renderChildren = this.renderChildren.bind(this);
  }

  renderChildren() {
    const { nodes, id } = this.props;
    const { childIds } = nodes[id];
    const result = [];
    const pathResult = [];

    childIds.forEach((pathId) => {
      const path = nodes[pathId];
      if (this.props.ui.selected.path === pathId || this.props.ui.hovered.path === pathId || this.props.ui.uiState === SELECTION_MODE) {
        forEachNode(pathId, nodes, (point, inControl, outControl, i, length) => {
          //Draw on curve point
          if (i === length - 1 && nodes[pathId].isClosed) {
            return;
          }

          result.push(
            <SvgSelector
              point={point}
              key={pathId + i}
              className="contour-point"
              hovered={this.props.ui.hovered.point}
              nodes={this.props.nodes}
            />
          );
          //Draw in control
          if (inControl) {
            result.push(
              <SvgSelector
                point={inControl}
                key={`${pathId}in${i}`}
                className="control-point"
                hovered={this.props.ui.hovered.point}
                source={point}
                parent={pathId}
                type="in"
                nodes={this.props.nodes}
              />
            );
          }
          //Draw out control
          if (outControl) {
            result.push(
              <SvgSelector
                point={outControl}
                key={`${pathId}out${i}`}
                className="control-point"
                hovered={this.props.ui.hovered.point}
                source={point}
                parent={pathId}
                type="out"
                nodes={this.props.nodes}
              />
            );
          }
          // Draw node parameters controls
          if (this.props.ui.hovered.point === point.id && (inControl || outControl)) {
            result.push(
              <SvgNodeControls
                point={point}
                key={`${pathId}controls${i}`}
                inControl={inControl || outControl}
                pathId={pathId}
                i={i}
              />
            );
          }
          // Draw the path indicator
          /*if (i === length - 1
            && !this.props.nodes[pathId].isClosed
            && this.props.ui.selected.path === pathId
            && this.props.ui.uiState === PATH_SELECTED) {
            result.push(
              <path
                className="path-indicator"
                key={`path-indicator-${pathId}`}
                d={`
                  M${point.x} ${point.y}
                  C${outControl.x},${outControl.y} ${this.props.ui.mouse.x},${this.props.ui.mouse.y} ${this.props.ui.mouse.x},${this.props.ui.mouse.y}`
                }/>);
          }*/
        });
        if (this.props.ui.uiState !== SELECTION_MODE) {
          const bbox = getPathBbox(pathId, nodes);
          //Draw path bounding box
          result.push(
            <path className="bbox" key={`bbox-${pathId}`} d={`M${bbox.minX} ${bbox.minY} L${bbox.maxX} ${bbox.minY} L${bbox.maxX} ${bbox.maxY} L${bbox.minX} ${bbox.maxY} L${bbox.minX} ${bbox.minY}`}/>
          )
        }
      }
    });
    return pathResult.concat(result);
  }

  render() {
    return (
      <g>
        {this.renderChildren()}
      </g>
    );
  }
}

SvgContourSelection.propTypes = {
  actions: PropTypes.object.isRequired,
}

function mapStateToProps(state, props) {
  return {
    nodes: getCalculatedGlyph(
      state,
      getCalculatedParams(state.nodes.font_initial.params),
      getParentGlyphId(state.nodes, props.id)
    ),
    ui: state.ui,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SvgContourSelection);
