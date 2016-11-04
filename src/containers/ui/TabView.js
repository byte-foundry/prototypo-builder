import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '~/actions';

require('styles/ui/TabView.scss');

class TabView extends PureComponent {
  render() {
    return (
      <div className="TabView">
        <ul className="tabs">
          <li>
            <input type="radio" name="tabs" id="list" />
            <label htmlFor="list">Nom de ma fonte</label>
          </li>
          <li>
            <input type="radio" name="tabs" id="glyph1" />
            <label htmlFor="glyph1">A</label>
          </li>
        </ul>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(TabView);
