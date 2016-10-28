require('styles/knacss/knacss.scss');
require('styles/App.css');

import React from 'react';
import TextRoot from './../containers/text/TextRoot';
import SvgContainer from './../containers/svg/SvgContainer';
import DebugInfos from '../containers/ui/DebugInfos';

class AppComponent extends React.Component {
  render() {
    return (
      <div className="grid-1-2 app">
        <div className="left-panel">
          <TextRoot id={'root'} />
          <DebugInfos />
        </div>
        <div className="right-panel">
          <SvgContainer />
        </div>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
