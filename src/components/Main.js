require('styles/knacss/knacss.scss');
require('styles/App.css');

import React from 'react';
import TextRoot from './../containers/text/TextRoot';
import SvgRoot from './../containers/svg/SvgRoot';

class AppComponent extends React.Component {
  render() {
    return (
      <div className="grid-2">
        <div>
          <TextRoot id={'root'} />
        </div>
        <div>
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
            viewBox="-800 -1400 2000 2000"
          >
            <g transform="matrix(1 0 0 -1 0 0)">
              <SvgRoot id={'root'} />
            </g>
          </svg>
        </div>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
