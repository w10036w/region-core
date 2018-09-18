import React, { PureComponent, Fragment } from 'react';
import './layout.css';

class Layout extends PureComponent {
  render() {
    const { children } = this.props;
    return (
      <Fragment>
        {children.map((child, index) => (
          <div key={index} className="panel">
            {child}
          </div>
        ))}
      </Fragment>
    );
  }
}

export default Layout;
