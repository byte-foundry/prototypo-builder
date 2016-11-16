import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '~/actions';

require('styles/ui/TabView.scss');

class TabView extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      activeType: props.ui.activeTab.type || 'all',
      activeGlyph: props.ui.activeTab.glyph || undefined,
    }
  }

  componentWillReceiveProps(newProps){
    this.setState({activeType: newProps.ui.activeTab.type, activeGlyph: newProps.ui.activeTab.glyph});
  }

  handleTabClick(type, glyph = undefined) {
    this.props.actions.setActiveTab(type, glyph);
    this.setState({activeType: type, activeGlyph: glyph});
  }

  shouldBeActive(type, glyph = undefined) {
    return (this.state.activeType === type && this.state.activeGlyph === glyph);
  }

  render() {
    return (
      <div className="TabView">
        <ul className="tabs">
          <li>
            <input type="radio" name="tabs" id="list"
              checked={this.shouldBeActive('all')}
              onChange={() => this.handleTabClick('all')}
            />
            <label htmlFor="list">Nom de ma fonte</label>
          </li>
          <li>
            <input type="radio" name="tabs" id="glyph1"
              checked={this.shouldBeActive('single', 'A')}
              onChange={() => this.handleTabClick('single', 'A')}
            />
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
