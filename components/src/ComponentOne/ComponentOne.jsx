import React from 'react';
import './ComponentOne.less';

const ComponentOne = (props) => (
  <div className="component-one">
    <span role="img" aria-label="React Logo">
      ⚛️
    </span>
    {' '}
    Comp One {props.a}
  </div>
);

export default ComponentOne;
