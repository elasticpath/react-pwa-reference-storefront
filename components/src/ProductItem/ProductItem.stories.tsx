import React from 'react';
import {storiesOf} from '@storybook/react';

import { ProductItem } from './ProductItem';

storiesOf('ProductItem', module).add('Default', () => <ProductItem productId="abc" />);
