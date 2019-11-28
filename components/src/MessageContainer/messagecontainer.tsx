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

import React, { Component } from 'react';
import { ReactComponent as CloseIcon } from '../../../app/src/images/icons/close-icon.svg';
import { ReactComponent as ErrorIcon } from '../../../app/src/images/icons/error-icon.svg';
import { ReactComponent as WarningIcon } from '../../../app/src/images/icons/warning-icon.svg';
import { ReactComponent as InfoIcon } from '../../../app/src/images/icons/info-icon.svg';
import { ErrorRemove } from '../../../app/src/utils/MessageContext';

import './messagecontainer.less';

interface MessageContainerProps {
  /** message */
  message: any
}

interface MessageContainerState {
  messages: any,
}

class MessageContainer extends Component<MessageContainerProps, MessageContainerState> {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
    this.handleCloseMessageContainer = this.handleCloseMessageContainer.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ messages: nextProps.message });
  }

  handleCloseMessageContainer(index) {
    const { messages } = this.state;
    const arrayMsg = [...messages];
    arrayMsg.splice(index, 1);
    this.setState({ messages: arrayMsg });
    ErrorRemove(index);
  }

  render() {
    const { messages } = this.state;
    if (messages.length > 0) {
      return (
        <div className="debug-messages-block">
          <div className="debug-messages-inner">
            {messages.map((el, index) => {
              let messageType = '';
              if (el.type === 'error' && el.id.includes('field')) {
                messageType = 'warning-message';
              } else if (el.type === 'error') {
                messageType = 'danger-message';
              } else if (el.type === 'needinfo') {
                messageType = 'info-message';
              }
              return (
                <div className={`container debug-messages-container ${messageType}`} key={`${el.id}_${Math.random().toString(36).substr(2, 9)}`}>
                  <ErrorIcon className="debug-msg-icon error" />
                  <WarningIcon className="debug-msg-icon warning" />
                  <InfoIcon className="debug-msg-icon info" />
                  <p>
                    {el.debugMessages}
                  </p>
                  <button type="button" className="close-btn" onClick={() => this.handleCloseMessageContainer(index)}>
                    <CloseIcon />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  }
}

export default MessageContainer;
