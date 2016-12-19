import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';

import * as actions from '~/actions';

import {
  SELECTION_MODE,
  NO_PATH_SELECTED,
} from '~/const';

require('styles/ui/toolbar.scss');

class UiToolbar extends PureComponent {
  setSelectMode() {
    this.props.actions.setMouseState(SELECTION_MODE);
    this.props.actions.setPathSelected(undefined, undefined);
    this.props.actions.setNodeSelected(undefined, undefined);
  }

  setDrawMode() {
    this.props.actions.setMouseState(NO_PATH_SELECTED);
    this.props.actions.setPathSelected(undefined, undefined);
  }

  render() {
    const selectClasses = classnames({
      'toolbar-item': true,
      'is-active': this.props.ui.uiState <= SELECTION_MODE,
    });

    const drawClasses = classnames({
      'toolbar-item': true,
      'is-active': this.props.ui.uiState >= NO_PATH_SELECTED,
    });

    return (
      <ul className="toolbar">
        <li className={selectClasses} onClick={this.setSelectMode.bind(this)}>
          <img src="/images/cursor.png"/>
        </li>
        <li className={drawClasses} onClick={this.setDrawMode.bind(this)}>
          <img src="/images/pen-icon.png"/>
        </li>
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
