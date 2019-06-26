import React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router';

import Carousel from './carousel.homepage';

// Option defaults.

const carouselLink = '';

storiesOf('Carousel', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('Carousel', () => <Carousel carouselLink={carouselLink} />);
