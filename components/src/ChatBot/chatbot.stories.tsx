import React from 'react';
import { storiesOf } from '@storybook/react';

import ChatComponent from './chatbot';

storiesOf('ChatComponent', module)
    .add('ChatComponent', () => {
        return (
            <ChatComponent />
        );
    });
