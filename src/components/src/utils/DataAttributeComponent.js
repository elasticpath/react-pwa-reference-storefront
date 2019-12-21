/**
 * Copyright © 2019 Elastic Path Software Inc. All rights reserved.
 *
 * This is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this license. If not, see
 *
 *     https://www.gnu.org/licenses/
 *
 *
 */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

class DataAttributeComponent extends React.Component {
  static propTypes = {
    ChildComponents: PropTypes.objectOf(PropTypes.object),
    // eslint-disable-next-line react/forbid-prop-types
    childProps: PropTypes.any,
  }

  static defaultProps = {
    ChildComponents: undefined,
    childProps: undefined,
  }

  static collectAndDecodeDataAttributes(dataset) {
    const data = {};

    Object.keys(dataset).forEach((key) => {
      const val = dataset[key];
      if (DataAttributeComponent.isBase64(val)) {
        data[key] = atob(val);
      } else {
        data[key] = val;
      }
    });

    return data;
  }

  static isBase64(str) {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  }

  constructor() {
    super();
    this.state = {
      attributesMap: null,
    };
  }

  componentDidMount() {
    /* eslint-disable react/no-find-dom-node */
    const parent = ReactDOM.findDOMNode(this).parentElement;
    if (parent) {
      const { dataset } = parent;
      const transformedData = DataAttributeComponent.collectAndDecodeDataAttributes(dataset);
      this.setState({
        attributesMap: transformedData,
      });
    } else {
      this.setState({
        attributesMap: undefined,
      });
    }
  }

  render() {
    const { attributesMap } = this.state;
    if (attributesMap !== null) {
      /* eslint-disable react/prop-types */
      const { ChildComponent, childProps } = this.props;
      return (<ChildComponent dataSet={attributesMap} {...childProps} />);
    }
    return (<span />);
  }
}

const withDataAttributes = Component => props => (
  <DataAttributeComponent ChildComponent={Component} childProps={props} />
);

export default withDataAttributes;
