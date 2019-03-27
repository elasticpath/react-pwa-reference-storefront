/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
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

import './bulkorder.main.less';

const Config = require('Config');

class TextEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value || '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.state.value) {
      this.setState({ value: nextProps.value });
    }
  }

  handleChange(newValue) {
    this.setState({ value: newValue });
  }

  handleBlur() {
    if (this.props.value !== this.state.value && this.props.onUpdate) {
      this.props.onUpdate(this.state.value);
    }
  }

  render() {
    return (
      <input
        value={this.state.value}
        onChange={e => this.handleChange(e.target.value)}
        onBlur={() => this.handleBlur()}
      />
    );
  }
}

export class BulkOrder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [
        { sku: 'asd', quantity: 1 },
        { sku: 'qwe', quantity: 1 },
        { sku: 'zxc', quantity: 2 },
      ],
      freeItemSku: '',
      freeItemQty: 1,
      csvText: '',
    };
  }

  componentDidMount() {
    this.updateCsvText();
  }

  updateCsvText() {
    this.setState({ csvText: this.state.items.map(item => `${item.sku}   ${item.quantity}`).join('\n') });
  }

  parseCsvText() {
    const items = this.state.csvText
      .split('\n')
      .filter(l => l.trim().length)
      .map(l => l.split(/[ ,;]+/))
      .map(p => ({ sku: p[0] || '', quantity: isNaN(parseInt(p[1])) ? 1 : parseInt(p[1])}));

    this.setState({ items });
  }

  handleUpdateSku(item, newSku) {
    item.sku = newSku;
    this.setState({ items: this.state.items }, () => this.updateCsvText());
  }

  handleQtyChange(item, newQty) {
    item.quantity = newQty;
    this.setState({ items: this.state.items }, () => this.updateCsvText());
  }

  handleFreeItemUpdateSku(newSku) {
    const newItem = { sku: newSku, quantity: this.state.freeItemQty };
    this.state.items.push(newItem);

    this.setState({ items: this.state.items, freeItemSku: '', freeItemQty: 1 }, () => this.updateCsvText());
  }

  handleFreeItemQtyChange(newQty) {
    this.setState({ freeItemQty: newQty });
  }

  handleCsvChange(newCsvValue) {
    this.setState({ csvText: newCsvValue }, () => this.parseCsvText());
  }

  render() {
    const quantities = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(q => <option key={q} value={q}>{q}</option>);

    return (
      <div className="bulk-order-component">
        <div className="bulk-modal">
          <div className="items-title">Items</div>
          <div className="items-list">
            {this.state.items.map(item => (
              <div key={item.sku} className="bulk-item">
                <TextEdit value={item.sku} onUpdate={(newSku) => this.handleUpdateSku(item, newSku)} />
                <select value={item.quantity} onChange={e => this.handleQtyChange(item, e.target.value)}>{quantities}</select>
              </div>
            ))}
            <div className="bulk-item free-item">
              <TextEdit value={this.state.freeItemSku} onUpdate={(newSku) => this.handleFreeItemUpdateSku(newSku)} />
              <select value={this.state.freeItemQty} onChange={e => this.handleFreeItemQtyChange(e.target.value)}>{quantities}</select>
            </div>
          </div>
          <textarea className="bulk-csv" rows={5} value={this.state.csvText} onChange={e => this.handleCsvChange(e.target.value)}></textarea>
          <code><pre>
            {JSON.stringify(this.state, null, 2)}
          </pre></code>
        </div>
      </div>
    );
  }
}

export default BulkOrder;
