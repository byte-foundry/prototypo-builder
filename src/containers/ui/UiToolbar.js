import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';

import actions from '~/actions';

import {
  SELECTION_MODE,
  NO_PATH_SELECTED
} from '~/const';

require('styles/ui/toolbar.scss');

class UiToolbar extends Component {
  setSelectMode() {
    this.props.actions.setMouseState(SELECTION_MODE);
    this.props.actions.setPathSelected(undefined, undefined);
    this.props.actions.setNodeSelected(undefined, undefined);
  }

  setDrawMode() {
    this.props.actions.setMouseState(NO_PATH_SELECTED);
    this.props.actions.setPathSelected(undefined, undefined);
  }

  saveNodes() {
    const json = JSON.stringify({
      nodes: this.props.nodes,
      formulas: this.props.formulas
    });

    const blob = new Blob([json], {type: 'octet/stream'});
    const url = window.URL.createObjectURL(blob);

    const a = this.refs.downloadLink;
    a.href = url;
    a.download = 'prototypo-json-save.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  render() {
    const selectClasses = classnames({
      'toolbar-item': true,
      'is-active': this.props.ui.uiState <= SELECTION_MODE
    });

    const drawClasses = classnames({
      'toolbar-item': true,
      'is-active': this.props.ui.uiState >= NO_PATH_SELECTED
    });

    return (
      <ul className="toolbar">
        <li className={selectClasses} onClick={this.setSelectMode.bind(this)}>
          <img src="/images/cursor.png"/>
        </li>
        <li className={drawClasses} onClick={this.setDrawMode.bind(this)}>
          <img src="/images/pen-icon.png"/>
        </li>
        <li className="toolbar-item" onClick={this.saveNodes.bind(this)}>
          <img src="/images/save-icon.png"/>
        </li>
        <a ref="downloadLink" style={{display: 'none'}}></a>
      </ul>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  const actionMap = { actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}

export default connect(mapStateToProps, mapDispatchToProps)(UiToolbar);
