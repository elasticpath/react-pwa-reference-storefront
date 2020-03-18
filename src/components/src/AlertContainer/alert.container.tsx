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
import { ReactComponent as CheckCircleIcon } from '../../../images/icons/check-circle-filled.svg';
import { ReactComponent as ErrorIcon } from '../../../images/icons/error-icon.svg';

import './alert.container.less';

interface AlertContainerProps {
  /** displayed message */
  messageData: any,
}

function AlertContainer(props:AlertContainerProps) {
  const { messageData } = props;

  return (
    <div className={`alert-container ${messageData.isSuccess ? 'success' : ''}`}>
      <div className="container">
        <div className="message-wrap">
          <p className="message">
            {messageData.isSuccess ? (
              <CheckCircleIcon className="style-icon" />
            ) : (
              <ErrorIcon className="error-icon style-icon" />
            )}
            {messageData.message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AlertContainer;
