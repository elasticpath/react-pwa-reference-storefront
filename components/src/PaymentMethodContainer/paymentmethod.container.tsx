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

interface PaymentMethodContainerProps {
  displayName: { [key: string]: any },
}

const PaymentMethodContainer: React.FunctionComponent<PaymentMethodContainerProps> = (props: PaymentMethodContainerProps) => {
  const { displayName } = props;
  const displayAppliedAmount = (displayName.appliedAmountDisplay) ? (` - ${displayName.appliedAmountDisplay || ''}`) : '';
  const displayTransactionType = (displayName.transactionType) ? (` - ${displayName.transactionType || ''}`) : '';
  let displayNameVar = displayName.displayValue || displayName.displayName;
  if (!displayNameVar && displayName.provider) {
    displayNameVar = `${displayName.provider.toLowerCase().replace(/_/g, ' ')}`;
  }

  return displayNameVar
    ? (
      <p className="payment-method-container">
        {displayNameVar}
        {displayAppliedAmount}
        {displayTransactionType}
      </p>
    )
    : '';
};

export default PaymentMethodContainer;
