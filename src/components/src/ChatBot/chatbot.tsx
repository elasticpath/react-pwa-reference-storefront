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
import { Interactions } from 'aws-amplify';
import { ThemeProvider } from 'styled-components';
import ChatBot from 'react-simple-chatbot';
import Review from './chatbot.review';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax,import/no-unresolved,import/no-duplicates
import * as styles from '!!../utils/less-var-loader!./chatbot.less';

import { getConfig, IEpConfig } from '../utils/ConfigProvider';

// eslint-disable-next-line import/no-duplicates
import './chatbot.less';

let Config: IEpConfig | any = {};

const theme = {
  background: styles['@chatBackground'],
  fontFamily: styles['@chatFontFamily'],
  headerBgColor: styles['@chatHeaderBgColor'],
  headerFontColor: styles['@chatHeaderFontColor'],
  headerFontSize: styles['@chatHeaderFontSize'],
  botBubbleColor: styles['@chatBotBubbleColor'],
  botFontColor: styles['@chatBotFontColor'],
  userBubbleColor: styles['@chatUserBubbleColor'],
  userFontColor: styles['@chatUserFontColor'],
};

interface ChatComponentState {
  opened: boolean,
  triggerId: string,
}

async function AuthenticateModel() {
  const botName = Config.chatbot.name;
  const authInput = `ep-auth ${localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`).split(' ')[1]}`;

  await Interactions.send(botName, authInput);
}

class ChatComponent extends React.Component<{}, ChatComponentState> {
  constructor(props) {
    super(props);

    const epConfig = getConfig();
    Config = epConfig.config;

    this.state = {
      opened: false,
      triggerId: 'userMessage',
    };

    this.toggleFloating = this.toggleFloating.bind(this);
  }

  componentWillMount() {
    const isLoggedInUser = localStorage.getItem(`${Config.cortexApi.scope}_oAuthRole`) === 'REGISTERED';
    const botEnable = Config.chatbot.enable;
    if (isLoggedInUser && botEnable) {
      AuthenticateModel();
    }
  }

  toggleFloating() {
    const { opened } = this.state;
    this.setState({ opened: !opened });
  }

  render() {
    const { opened, triggerId } = this.state;

    const isLoggedInUser = localStorage.getItem(`${Config.cortexApi.scope}_oAuthRole`) === 'REGISTERED';
    const botEnable = Config.chatbot.enable;

    const steps = [
      {
        id: '0',
        message: intl.get('chatbot-welcome-msg'),
        trigger: 'userMessage',
      },
      {
        id: 'userMessage',
        user: true,
        validator: (value) => {
          if (!(value)) {
            return intl.get('enter-your-message');
          }
          return true;
        },
        trigger: 'review',
      },
      {
        id: 'review',
        component: <Review />,
        asMessage: true,
        trigger: triggerId,
      },
    ];

    if (isLoggedInUser && botEnable) {
      return (
        <div className="rsc-wrapper">
          <ThemeProvider theme={theme}>
            <ChatBot
              steps={steps}
              floating
              opened={opened}
              toggleFloating={this.toggleFloating}
            />
          </ThemeProvider>
        </div>
      );
    }
    return null;
  }
}

export default ChatComponent;
