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
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './tabselection.scss';

interface TabSelectionProps {
  /** option */
  tabs: string[]
  data: any[]
}

interface TabSelectionState {
  /** option */
  isOpen: boolean
  selectedValue: number
}

export default class TabSelection extends React.Component<TabSelectionProps, TabSelectionState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isOpen: false,
      selectedValue: 0,
    };

    this.clickListener = this.clickListener.bind(this);
    this.setValue = this.setValue.bind(this);
  }

  handleSwitcherClicked(e) {
    this.setState({ isOpen: true });
    document.addEventListener('click', this.clickListener);

    e.preventDefault();
    e.stopPropagation();
  }

  clickListener() {
    this.setState({ isOpen: false });
    document.removeEventListener('click', this.clickListener);
  }

  setValue = (index) => {
    this.setState({
      selectedValue: index,
    });
  };


  render() {
    const { tabs, data } = this.props;
    const { isOpen, selectedValue } = this.state;

    return (
      <Tabs
        selectedIndex={selectedValue}
        onSelect={() => {}}
      >
        <TabList>
          {tabs.map((tab, index) => (
            <Tab onClick={() => this.setValue(index)} key={tab}>{tab}</Tab>
          ))}
        </TabList>
        <div className="side-menu-component dropdown-menu">
          <button
            className="side-menu-component-title"
            onClick={e => this.handleSwitcherClicked(e)}
            type="button"
            aria-label="navigation menu"
          >
            {tabs[selectedValue]}
          </button>
          <div className={`side-menu-component-dropdown ${isOpen ? '' : 'hidden'}`}>
            {tabs.map((elem, index) => (
              <div key={elem}>
                <div className="menu-item" role="presentation" key={elem} onClick={() => this.setValue(index)}>{elem}</div>
              </div>
            ))}
          </div>
        </div>
        {data.map(tabData => (
          <TabPanel key={`_${Math.random().toString(36).substr(2, 9)}`}>
            {tabData}
          </TabPanel>
        ))}
      </Tabs>
    );
  }
}
