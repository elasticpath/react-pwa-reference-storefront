import React from 'react';
import {storiesOf} from '@storybook/react';
import { MemoryRouter } from 'react-router';

import BulkOrder from './bulkorder.main';

function handleBulkModalClose() {
}

storiesOf('BulkOrder', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('BulkOrder', () => {
    return (
        <div style={{'position':'relative'}}>
          <BulkOrder handleClose={handleBulkModalClose} isBulkModalOpened={true} />
        </div>
    );
  });
