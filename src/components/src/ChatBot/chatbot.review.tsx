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
import Amplify, { Interactions } from 'aws-amplify';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax,import/no-unresolved
import awsmobile from '../../../aws-exports';
import './chatbot.review.less';

import { getConfig, IEpConfig } from '../utils/ConfigProvider';

Amplify.configure(awsmobile);

let Config: IEpConfig | any = {};

interface ReviewProps {
  /** steps */
    steps?: any,
}

interface ReviewState {
    userMessage: string,
    productImageUrl: string,
}

async function InvokeIntent(utterance) {
  const botName = Config.chatbot.name;
  const response = await Interactions.send(botName, utterance);
  // eslint-disable-next-line no-use-before-define
  Interactions.onComplete(botName, handleCompleteIntent);
  return response;
}

const handleCompleteIntent = (err, confirmation) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.error('Conversation failed...');
    return;
  }
  // eslint-disable-next-line consistent-return
  return 'Conversation success!';
};

class Review extends Component<ReviewProps, ReviewState> {
  constructor(props) {
    super(props);
    const epConfig = getConfig();
    Config = epConfig.config;
    this.state = {
      userMessage: '',
      productImageUrl: '',
    };
  }

  componentWillMount() {
    this.submitMessage();
  }

  async submitMessage() {
    const { steps } = this.props;
    const { message } = steps.userMessage;

    const response: any = await InvokeIntent(message);

    if (response.responseCard) {
      this.setState({ productImageUrl: response.responseCard.genericAttachments[0].imageUrl });
    }

    this.setState({ userMessage: response.message });
  }

  render() {
    const { userMessage, productImageUrl } = this.state;
    if (userMessage) {
      return (
        <div style={{ width: '100%' }}>
          <div className="chatbot-review">
            {userMessage}
            {productImageUrl && <img src={productImageUrl} alt="" />}
          </div>
        </div>
      );
    }
    return (
      <span className="rsc-loading">
        <span className="sc-bdVaJa hseFPs">.</span>
        <span className="sc-bdVaJa iTWArB">.</span>
        <span className="sc-bdVaJa dUwKYp">.</span>
      </span>
    );
  }
}

export default Review;
