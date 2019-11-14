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
import intl from 'react-intl-universal';
import Modal from 'react-responsive-modal';
import fileDownload from 'js-file-download';
import { B2bAddAssociatesMenu, B2bSideMenu } from '@elasticpath/store-components';
import RouteWithSubRoutes from '../../RouteWithSubRoutes';
import { adminFetch } from '../../utils/Cortex';
import * as Config from '../../ep.config.json';

import './B2BMain.less';

interface B2BMainProps {
  routes: {
    [key: string]: any
  },
  location: {
    [key: string]: any
  },
}

enum MessageType {
  success = 'success',
  error = 'error'
}

interface B2BMainState {
  associatesFormUrl?: string;
  isImportDialogOpen: boolean;
  exampleCsvFile: string;
  selectedFile?: HTMLInputElement;
  isUploading: boolean;
  messages: { type: MessageType; text: string; }[];
}

export default class B2BMain extends React.Component<B2BMainProps, B2BMainState> {
  fileInputRef: React.RefObject<HTMLInputElement>;

  constructor(props) {
    super(props);

    this.state = {
      associatesFormUrl: undefined,
      isImportDialogOpen: false,
      exampleCsvFile: '',
      selectedFile: undefined,
      isUploading: false,
      messages: [],
    };

    this.handleFileChange = this.handleFileChange.bind(this);
    this.fileInputRef = React.createRef<HTMLInputElement>();
  }

  async componentDidMount() {
    const result = await adminFetch('/?zoom=accounts,accounts:addassociatesform', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
      },
    })
      .then(r => r.json());

    if (result
      && result._accounts instanceof Array
      && result._accounts.length > 0
      && result._accounts[0]._addassociatesform instanceof Array
      && result._accounts[0]._addassociatesform[0]
      && result._accounts[0]._addassociatesform[0].self
    ) {
      const associatesFormUrl = `${Config.b2b.authServiceAPI.path}${result._accounts[0]._addassociatesform[0].self.uri}`;

      const exampleCsvFile = await fetch(associatesFormUrl, {
        headers: {
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
          Accept: 'text/csv',
        },
      })
        .then(r => r.text());

      this.setState({ associatesFormUrl, exampleCsvFile });
    }
  }

  handleSpreeadsheetClicked() {
    this.setState({ isImportDialogOpen: true });
  }

  handleTemplateClicked() {
    const { exampleCsvFile } = this.state;
    fileDownload(exampleCsvFile, 'example.csv', 'text/csv');
  }

  resetDialog() {
    this.setState({
      isImportDialogOpen: false,
      selectedFile: undefined,
      isUploading: false,
    });
  }

  handleImportDialogClose() {
    this.resetDialog();
  }

  handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ selectedFile: event.target });
  }

  async uploadSelectedFile(): Promise<any> {
    const formData = new FormData();
    const fileInput = this.fileInputRef.current;
    formData.append('associates', fileInput.files[0]);

    const options = {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
      },
    };

    const { associatesFormUrl } = this.state;
    return fetch(associatesFormUrl, options)
      .then(
        (result) => {
          if (result.status >= 200 && result.status < 300) {
            return Promise.resolve();
          }

          return result.json()
            .catch(_ => Promise.reject(new Error(intl.get('general-upload-error'))))
            .then((parsedJson) => {
              const errorMsg = parsedJson.messages.map(m => intl.get(`backend-message-${m.id}`) || m['debug-message']).join(' ');
              return Promise.reject(new Error(errorMsg));
            });
        },
        _ => Promise.reject(new Error(intl.get('general-upload-error'))),
      );
  }

  async handleSubmit() {
    const { messages } = this.state;
    this.setState({ isUploading: true });

    try {
      await this.uploadSelectedFile();

      this.setState({ messages: [...messages, { type: MessageType.success, text: intl.get('your-upload-was-successful') }] });
    } catch (err) {
      this.setState({ messages: [...messages, { type: MessageType.error, text: err.message }] });
    }

    this.resetDialog();
  }

  render() {
    const { routes } = this.props;
    const {
      messages,
      isImportDialogOpen,
      associatesFormUrl,
      selectedFile,
      isUploading,
      exampleCsvFile,
    } = this.state;

    const sideMenuItems = [
      { to: '/b2b', children: 'accounts' },
      // { to: '/b2b/address-book', children: 'address-book' },
      // { to: '/b2b/orders', children: 'orders' },
      // { to: '/b2b/approvals', children: 'approvals' },
      // { to: '/b2b/invitations', children: 'invitations' },
      // { to: '/b2b/requisition-lists', children: 'requisition-lists' },
      // { to: '/b2b/quotes', children: 'quotes' },
    ];

    return (
      <div className="b2b-main-component">
        <div className="message-boxes">
          {messages.map((message, index) => (
            /* eslint-disable-next-line react/no-array-index-key */
            <div key={index} className={`message-box ${message.type.toString()}`}>
              <div className="container">
                <div className="message">
                  {message.text}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="container">
          <div className="b2b-header">
            <div className="page-title">{intl.get('business-account')}</div>
            {associatesFormUrl && (
              <div className="quick-menu">
                <B2bAddAssociatesMenu
                  onSpreeadsheetClicked={() => this.handleSpreeadsheetClicked()}
                  onTemplateClicked={() => this.handleTemplateClicked()}
                />
              </div>
            )}
          </div>
          <div className="b2b-central">
            <div className="b2b-side">
              <B2bSideMenu {...this.props} sideMenuItems={sideMenuItems} />
            </div>
            <div className="b2b-content">
              <div className="account-description">{intl.get('buyer-admin-has-the-capability')}</div>
              {routes.map(route => (
                <RouteWithSubRoutes key={route.path} {...route} />
              ))}
            </div>
          </div>
        </div>

        <Modal
          open={isImportDialogOpen}
          onClose={() => this.handleImportDialogClose()}
          classNames={{ modal: 'b2b-import-associate-dialog', closeButton: 'b2b-dialog-close-btn' }}
        >
          <div className="dialog-header">{intl.get('select-your-file')}</div>
          <div className="dialog-content">
            <div className="upload-title">{intl.get('upload-associatess-csv')}</div>
            <div className="chose-btn-container">
              <input id="file-upload" className="chose-btn" type="file" name="associates" ref={this.fileInputRef} onChange={this.handleFileChange} />
              <label className="chose-btn-label" htmlFor="file-upload">Choose file</label>
              <span>{selectedFile ? selectedFile.value.split('\\').pop() : intl.get('no-file-selected')}</span>
            </div>
            <div className="capital-or">{intl.get('capital-or')}</div>
            <div className="download-sample">
              <a href={`data:text/csv;base64,${btoa(exampleCsvFile)}`} download="example.csv">{intl.get('download')}</a>
              {' '}
              {intl.get('a-sample-file')}
            </div>
          </div>
          <div className="dialog-footer">
            <button className="cancel" type="button" onClick={() => this.handleImportDialogClose()}>{intl.get('cancel')}</button>
            <button className="upload" type="submit" disabled={!selectedFile || isUploading} onClick={() => this.handleSubmit()}>{intl.get('upload')}</button>
          </div>
        </Modal>

      </div>
    );
  }
}
