require('styles/knacss/knacss.scss');
require('styles/App.css');

import React from 'react';
import TextRoot from './../containers/text/TextRoot';
import SvgContainer from './../containers/svg/SvgContainer';
import DebugInfos from '../containers/ui/DebugInfos';
import TabView from './../containers/ui/TabView';

class AppComponent extends React.Component {
  render() {
    return (
      <div className="grid-1-2 app">
        <div className="left-panel">
          <TextRoot id={'root'} />
          <DebugInfos />
        </div>
        <div className="right-panel">
          <TabView />
          <SvgContainer />
        </div>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
