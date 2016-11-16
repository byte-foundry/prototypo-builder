require('styles/knacss/knacss.scss');
require('styles/App.css');

import React from 'react';
import TextRoot from './../containers/text/TextRoot';
import FontSettings from './../containers/text/FontSettings';
import SvgContainer from './../containers/svg/SvgContainer';
import Settings from '../containers/ui/Settings';
import TabView from './../containers/ui/TabView';
import GlyphList from './../containers/svg/GlyphList';

class AppComponent extends React.Component {
  render() {
    return (
      <div className="grid app">
        <div className="left-panel one-third">
          {this.props.ui.activeTab.type === 'all' ?
            <FontSettings />:
            <TextRoot id={'root'} />
          }
        </div>
        <div className="right-panel two-thirds">
          <TabView />
          {this.props.ui.activeTab.type === 'all' ?
          <div>
            <GlyphList />
          </div>:
          <span>
            <SvgContainer />
            <Settings />
          </span>
        }
        </div>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
