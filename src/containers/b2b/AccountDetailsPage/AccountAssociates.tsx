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

import React, { useState, useEffect } from 'react';
import intl from 'react-intl-universal';
import Modal from 'react-responsive-modal';
import { login } from '../../../hooks/store';
import { cortexFetch } from '../../../components/src/utils/Cortex';
import Config from '../../../ep.config.json';

import './AccountAssociates.scss';
import { ReactComponent as CloseIcon } from '../../../images/icons/ic_close.svg';
import AlertContainer from '../../../components/src/AlertContainer/alert.container';

interface AccountAssociatesProps {
  history: any
  checkIsDisabled: (key: boolean) => any
  setIsCreateAssociateModalClose: () => any
  openCreateAssociateModal: () => any
  isCreateAssociateModalOpen: boolean
  isReadOnly: boolean
}

const zoomArray = [
  'associates',
  'associates:element',
  'associates:element:associatedetails',
  'associates:addassociateform',
  'associates:addassociateform:addassociateaction',
];

const AccountAssociates: React.FC<AccountAssociatesProps> = ({
  history, checkIsDisabled, isCreateAssociateModalOpen, openCreateAssociateModal, setIsCreateAssociateModalClose, isReadOnly,
}) => {
  const [associatesData, setAssociatesData] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMiniLoading, setIsMiniLoading] = useState<boolean>(false);
  const [isOpenConfirmRemoveModal, setIsOpenConfirmRemoveModal] = useState<boolean>(false);
  const [selectedAssociate, setSelectedAssociate] = useState<any>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [emailValue, setEmailValue] = useState<string>('');
  const [isShowAlert, setIsShowAlert] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [alertMessageData, setAlertMessageData] = useState<{ message?: string, isSuccess?: boolean }>({});

  const fetchAssociatesData = async () => {
    const { accountUri } = history.location.state;
    try {
      setIsLoading(true);
      await login();
      const res = await cortexFetch(`${accountUri}/?zoom=${zoomArray.join()}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      })
        .then(result => result.json());
      if (res) {
        setAssociatesData(res._associates[0]);
      }
      if (!res._associates[0]._addassociateform) {
        checkIsDisabled(true);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssociatesData();
    // eslint-disable-next-line
  }, []);

  const accountRoles = ['BUYER', 'CATALOG_BROWSER', 'SINGLE_SESSION_BUYER', 'LIMITED_CATALOG_BROWSER', 'BUYER_ADMIN'];

  const getRoleName = (role) => {
    let roleName = '';
    switch (role) {
      case 'BUYER_ADMIN': roleName = intl.get('buyer-admin'); break;
      case 'BUYER': roleName = intl.get('buyer'); break;
      case 'CATALOG_BROWSER': roleName = intl.get('catalog-browser'); break;
      case 'LIMITED_CATALOG_BROWSER': roleName = intl.get('limited-catalog-browser'); break;
      case 'SINGLE_SESSION_BUYER': roleName = intl.get('single-session-buyer'); break;
      default: roleName = '';
    }
    return roleName;
  };

  const onCloseModal = () => {
    setIsEditMode(false);
    setIsCreateAssociateModalClose();
  };

  const handleConfirmRemove = (associate) => {
    setSelectedAssociate(associate);
    setIsOpenConfirmRemoveModal(!isOpenConfirmRemoveModal);
  };

  const handleHideAlert = () => {
    setIsShowAlert(false);
  };

  const handleShowAlert = (message, isSuccess) => {
    setIsShowAlert(true);
    setAlertMessageData({ message, isSuccess });
    setTimeout(handleHideAlert, 5000);
  };

  const handleSaveAssociate = async () => {
    const { accountName } = history.location.state;

    setIsMiniLoading(true);
    const res = await cortexFetch(associatesData._addassociateform[0]._addassociateaction[0].self.uri, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
      body: JSON.stringify({
        email: emailValue,
        role: selectedRole,
      }),
    });
    if (res.status === 200) {
      await fetchAssociatesData();
      handleShowAlert(intl.get('associate-successfully-added', { account: accountName }), true);
    }
    setSelectedRole('');
    setEmailValue('');
    fetchAssociatesData();
    onCloseModal();
    setIsMiniLoading(false);
  };

  const handleEditAssociate = async () => {
    setIsMiniLoading(true);
    const res = await cortexFetch(selectedAssociate.self.uri, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
      },
      body: JSON.stringify({
        role: selectedRole,
      }),
    });
    if (res.status === 204) {
      handleShowAlert(intl.get('associate-successfully-updated'), true);
    } else {
      res.json().then(result => handleShowAlert(result.messages[0]['debug-message'], false));
    }
    setIsMiniLoading(false);
    await onCloseModal();
    setSelectedRole('');
    setEmailValue('');
    await fetchAssociatesData();
  };

  const handleDelete = async () => {
    setIsMiniLoading(true);
    try {
      await cortexFetch(selectedAssociate.self.uri, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`),
        },
      });
      await handleShowAlert(intl.get('associate-successfully-deleted'), true);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error.message);
    } finally {
      fetchAssociatesData();
      setIsMiniLoading(false);
      handleConfirmRemove('');
    }
  };

  const handleConfirmModal = () => (
    setIsOpenConfirmRemoveModal(!isOpenConfirmRemoveModal)
  );

  const setEmail = event => (
    setEmailValue(event.target.value)
  );

  const onSelectRole = role => (
    setSelectedRole(role)
  );


  const handleEdit = (value) => {
    openCreateAssociateModal();
    setIsEditMode(true);
    setSelectedAssociate(value);
    onSelectRole(value.role);
  };

  const renderNewAssociateModal = () => (
    <Modal open={isCreateAssociateModalOpen} onClose={() => onCloseModal()} showCloseIcon={false}>
      <div className="modal-lg new-associate-modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">
              {isEditMode ? intl.get('edit-associate') : intl.get('add-new-associate')}
            </h2>
            <button type="button" aria-label="close" className="close-modal-btn" onClick={onCloseModal}>
              <CloseIcon />
            </button>
          </div>
          <div className="modal-body">
            {isEditMode ? (
              <div className="associate-data">
                <div className="associate-field">
                  <div className="field-title">
                    {intl.get('first-name')}
                  </div>
                  <div className="field-value">
                    {selectedAssociate._associatedetails[0]['first-name']}
                  </div>
                </div>
                <div className="associate-field">
                  <div className="field-title">
                    {intl.get('last-name')}
                  </div>
                  <div className="field-value">
                    {selectedAssociate._associatedetails[0]['last-name']}
                  </div>
                </div>
                <div className="associate-field">
                  <div className="field-title">
                    {intl.get('email-id')}
                  </div>
                  <div className="field-value">
                    {selectedAssociate._associatedetails[0].email}
                  </div>
                </div>
              </div>
            ) : (
              <div className="email-input">
                <label htmlFor="nameField">
                  <span className="required-label">
                  *
                  </span>
                  {' '}
                  {intl.get('email')}
                </label>
                <input type="text" className="form-control" id="nameField" onChange={event => setEmail(event)} />
              </div>
            )}
            <div className={`${isEditMode && 'padding-field'} dropdown cart-selection-dropdown`}>
              {isEditMode ? (
                <div>
                  {intl.get('new-user-role')}
                </div>
              ) : (
                <div>
                  <span className="required-label">
                  *
                  </span>
                  {' '}
                  {intl.get('user-role')}
                </div>
              )}
              <button
                className="ep-btn btn-select-role dropdown-toggle"
                data-toggle="dropdown"
                disabled={false}
                type="button"
              >
                {getRoleName(selectedRole)}
              </button>
              <div className="dropdown-menu role-selection-menu">
                <div className="cart-selection-menu-wrap">
                  {accountRoles.map(role => (
                    <option key={role} value={role} className="associate-option" onClick={() => onSelectRole(role)}>
                      {getRoleName(role)}
                    </option>
                  ))}
                </div>
              </div>
            </div>
            <div className="dialog-footer btn-container">
              <button className="ep-btn cancel" type="button" onClick={onCloseModal}>{intl.get('cancel')}</button>
              <button className="ep-btn primary" type="button" onClick={isEditMode ? handleEditAssociate : handleSaveAssociate}>
                {intl.get('save')}
              </button>
            </div>
          </div>
        </div>
      </div>
      {isMiniLoading && (
        <div className="loader-wrapper">
          <div className="miniLoader" />
        </div>
      )}
    </Modal>
  );


  const confirmationRemoveModal = () => (
    <Modal
      open={isOpenConfirmRemoveModal}
      onClose={() => handleConfirmModal()}
      classNames={{ modal: 'delete-address-dialog' }}
    >
      <div className="dialog-header">{intl.get('remove-associate')}</div>
      <div className="dialog-content">
        <p>
          {intl.get('remove-associate-message', { email: selectedAssociate && selectedAssociate._associatedetails[0].email })}
        </p>
      </div>
      <div className="dialog-footer btn-container">
        <button className="ep-btn cancel" type="button" onClick={handleConfirmModal}>{intl.get('cancel')}</button>
        <button className="ep-btn primary upload" type="button" onClick={() => handleDelete()}>
          {intl.get('remove')}
        </button>
      </div>
      {isMiniLoading && (
        <div className="loader-wrapper">
          <div className="miniLoader" />
        </div>
      )}
    </Modal>
  );


  return (
    <div>
      {isLoading ? (
        <div className="loader" />
      ) : (
        <div>
          <p className="title">
            {intl.get('associates-list')}
          </p>
          {associatesData && !isLoading && (
            <div className="account-associates">
              {isShowAlert && (
                <AlertContainer messageData={alertMessageData} />
              )}
              <table className="b2b-table accounts-table">
                <thead>
                  <tr>
                    <th className="name">
                      {intl.get('name')}
                    </th>
                    <th className="email-id">
                      {intl.get('email-id')}
                    </th>
                    <th className="role">{intl.get('role')}</th>
                    <th>{intl.get('action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {associatesData._element ? associatesData._element.map(associate => (
                    <tr key={associate.self.uri} className="account-list-rows" onClick={() => {}}>
                      <td className="name">{`${associate._associatedetails[0]['first-name']} ${associate._associatedetails[0]['last-name']}`}</td>
                      <td className="email">{associate._associatedetails[0].email}</td>
                      <td className="role">{getRoleName(associate.role)}</td>
                      <td className="action-column">
                        <div className="action-wrapper">
                          <span className={`${isReadOnly && 'disabled-button'} action associate-edit`} role="presentation" onClick={() => !isReadOnly && handleEdit(associate)}>{intl.get('edit')}</span>
                          <span className={`${isReadOnly && 'disabled-button'} action`} role="presentation" onClick={() => !isReadOnly && handleConfirmRemove(associate)}>{intl.get('remove')}</span>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td className="no-data-message">{intl.get('no-account-associates')}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {confirmationRemoveModal()}
      {renderNewAssociateModal()}
    </div>
  );
};

export default AccountAssociates;
