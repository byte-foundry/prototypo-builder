require('styles/svg/Selection.scss');

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { forEachNode } from '../../_utils/pathWalkers';
import SvgSelector from '../../components/svg/SvgSelector';

import {
  mapDispatchToProps
} from './_utils';

class SvgContourSelection extends Component {
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
      forEachNode(pathId, nodes, (point, inControl, outControl, i) => {
        result.push(
          <SvgSelector
            point={point}
            key={i}
            className="contour-point"
            mouse={this.props.mouse}
            parentId={pathId}
            nodes={ this.props.nodes }
            setCoords={this.props.actions.setCoords}
            moveNode={this.props.actions.moveNode}
            updateProp={this.props.actions.updateProp}
            setNodeSelected={this.props.actions.setNodeSelected}
            setMouseState={this.props.actions.setMouseState}
          />
        );
        if (inControl) {
          pathResult.push(
            <path className="point-control" key={`point-in-${i}`} d={`M${point.x} ${point.y} L${inControl.x} ${inControl.y}`}/>
          );
          result.push(
            <SvgSelector
              point={inControl}
              key={`in${i}`}
              className="control-point"
              mouse={this.props.mouse}
              parentId={pathId}
              setCoords={this.props.actions.setCoords}
              moveNode={this.props.actions.moveNode}
              updateProp={this.props.actions.updateProp}
              setNodeSelected={this.props.actions.setNodeSelected}
              setMouseState={this.props.actions.setMouseState}
            />
          );
        }
        if (outControl) {
          pathResult.push(
            <path className="point-control" key={`point-out-${i}`} d={`M${point.x} ${point.y} L${outControl.x} ${outControl.y}`}/>
          );
          result.push(
            <SvgSelector
              point={outControl}
              key={`out${i}`}
              className="control-point"
              parentId={pathId}
              mouse={this.props.mouse}
              setCoords={this.props.actions.setCoords}
              moveNode={this.props.actions.moveNode}
              updateProp={this.props.actions.updateProp}
              setNodeSelected={this.props.actions.setNodeSelected}
              setMouseState={this.props.actions.setMouseState}
            />
          );
        }
      });
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
  actions: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return { nodes: state.nodes, mouse: state.ui.mouse };
}

export default connect(mapStateToProps, mapDispatchToProps)(SvgContourSelection);
