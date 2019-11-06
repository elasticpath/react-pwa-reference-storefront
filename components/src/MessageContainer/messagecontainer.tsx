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
import { ReactComponent as CloseIcon } from '../../../app/src/images/icons/close-icon.svg';
import { ReactComponent as ErrorIcon } from '../../../app/src/images/icons/error-icon.svg';
import { ReactComponent as WarningIcon } from '../../../app/src/images/icons/warning-icon.svg';
import { ReactComponent as InfoIcon } from '../../../app/src/images/icons/info-icon.svg';
import { ErrorInlet } from '../../../app/src/utils/count-context';

import './messagecontainer.less';

interface MessageContainerProps {
  message: any
}

class MessageContainer extends React.Component<MessageContainerProps> {
  static handleCloseErrorMsg() {
    ErrorInlet({});
  }

  render() {
    const { message } = this.props;
    if (message && message.debugMessages) {
      let messageType = '';
      if (message.type === 'error' && message.id.includes('field')) {
        messageType = 'warning-message';
      } else if (message.type === 'error') {
        messageType = 'danger-message';
      } else if (message.type === 'needinfo') {
        messageType = 'info-message';
      }
      return (
        <div className="debug-messages-block">
          <div className="debug-messages-inner">
            <div className={`container debug-messages-container ${messageType}`}>
              <ErrorIcon className="debug-msg-icon error" />
              <WarningIcon className="debug-msg-icon warning" />
              <InfoIcon className="debug-msg-icon info" />
              <p>
                {message.debugMessages}
              </p>
              <button type="button" className="close-btn" onClick={MessageContainer.handleCloseErrorMsg}>
                <CloseIcon />
              </button>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}

export default MessageContainer;
