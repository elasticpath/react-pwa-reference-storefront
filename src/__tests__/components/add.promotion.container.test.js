/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
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
import { shallow } from 'enzyme';
import AddPromotionContainer from '../../components/add.promotion.container';

describe('App', () => {
  it('renders with default props', () => {
    const cartData = {};
    const wrapper = shallow(<AddPromotionContainer data={cartData} onSubmittedPromotion={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
  
  it('opens form by clicking on button', () => {
    const cartData = {};
    const wrapper = shallow(<AddPromotionContainer data={cartData} onSubmittedPromotion={() => {}} />);
    const button = wrapper.find('button');
    button.simulate('click');
    expect (wrapper.find('form').exists()).toEqual(true);
    wrapper.unmount();
  });
  
  it('submits form', () => {
    const cartData = {};
    const wrapper = shallow(<AddPromotionContainer data={cartData} onSubmittedPromotion={() => {}} />);
    const button = wrapper.find('button');
    wrapper.instance().submitPromotionCode = jest.fn();
    wrapper.update();
    button.simulate('click');
    const form = wrapper.find('form');
    form.simulate('submit');
    expect(wrapper.instance().submitPromotionCode).toBeCalled();
    wrapper.unmount();
  });
});
