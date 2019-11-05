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

import './messagecontainer.less';

interface MessageContainerProps {
  message: any
}

class MessageContainer extends React.Component<MessageContainerProps> {
  componentDidMount() {}

  render() {
    const { message } = this.props;
    if (message && message.debugMessages) {
      let messageType = '';
      if (message.type === 'error' && message.id.includes('field')) {
        messageType = 'warning-message';
      } else if (message.type === 'error') {
        messageType = 'danger-message';
      } else if (message.type === 'needinfo') {
        messageType = 'dark-message';
      }
      return (
        <div className={`container debug-messages-container ${messageType}`}>
          <p>
            {message.debugMessages}
          </p>
        </div>
      );
    }
    return null;
  }
}

export default MessageContainer;
