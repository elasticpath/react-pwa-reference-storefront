import React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router';

import AppModalCartSelectMain from './appmodalcartselect.main';

function handleModalClose() {
}

storiesOf('AppModalCartSelectMain', module)
    .addDecorator(story => (
        <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ))
  .add('AppModalCartSelectMain', () => {
    return (
        <AppModalCartSelectMain handleModalClose={handleModalClose} openModal={true} />
    );
  });
