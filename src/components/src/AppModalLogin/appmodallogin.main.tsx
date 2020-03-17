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

import React, { Component, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-responsive-modal';
import { FormikErrors, useFormik } from 'formik';
import queryString from 'query-string';
import { loginRegistered, loginRegisteredAuthService } from '../utils/AuthService';
import { getConfig, IEpConfig } from '../utils/ConfigProvider';

import './appmodallogin.main.less';

let Config: IEpConfig | any = {};
let intl = { get: str => str };

interface AppModalLoginMainProps {
  /** handle modal close */
  handleModalClose: (...args: any[]) => any,
  /** handle open modal */
  openModal: boolean,
  /** handle login */
  onLogin?: (...args: any[]) => any,
  /** handle reset password */
  onResetPassword?: (...args: any[]) => any,
  /** location search data */
  locationSearchData?: string,
  /** location path name */
  locationPathName?: string,
  /** links for app modal login */
  appModalLoginLinks: {
    [key: string]: any
  },
  /** show forgot password link */
  showForgotPasswordLink: boolean,
  /** disable login */
  disableLogin?: boolean,
  /** Open Id Connect Parameters */
  oidcParameters?: {
    [key: string]: any
  },
}

interface LoginFormValues {
  username: string;
  password: string;
}

const AppModalLoginMain: React.FC<AppModalLoginMainProps> = (props) => {
  const {
    openModal,
    handleModalClose,
    onLogin,
    disableLogin,
    onResetPassword,
    showForgotPasswordLink,
    appModalLoginLinks,
  } = props;

  const registrationLink = appModalLoginLinks.registration;

  const [failedLogin, setFailedLogin] = useState(false);

  useEffect(() => {
    const epConfig = getConfig();
    Config = epConfig.config;
    ({ intl } = epConfig);
  }, []);

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      username: '',
      password: '',
    },
    validate: (values) => {
      const errors: FormikErrors<LoginFormValues> = {};
      if (!values.username || values.username.trim() === '') {
        errors.username = 'Username is required';
      }
      return errors;
    },
    onSubmit: async (values) => {
      if (disableLogin) {
        return;
      }

      if (localStorage.getItem(`${Config.cortexApi.scope}_oAuthRole`) === 'PUBLIC') {
        const resStatus = await loginRegistered(values.username, values.password);

        if (resStatus === 200) {
          setFailedLogin(false);
          handleModalClose();
          onLogin();
        } else {
          setFailedLogin(true);
        }
      }
    },
  });

  const { resetForm } = formik;

  useEffect(() => {
    if (openModal) {
      setFailedLogin(false);
      resetForm();
    }
  }, [openModal, resetForm]);

  const handleResetPasswordClicked = () => {
    onResetPassword();
    handleModalClose();
  };

  return (
    <Modal open={openModal} onClose={handleModalClose} classNames={{ modal: 'login-modal-content' }}>
      <div id="login-modal">
        <div className="modal-content" id="simplemodal-container">

          <div className="modal-header">
            <h2 className="modal-title">
              {intl.get('login')}
            </h2>
          </div>

          <div className="feedback-label auth-feedback-container" id="login_modal_auth_feedback_container">
            {failedLogin ? (intl.get('invalid-username-or-password')) : ('')}
          </div>

          <div className="modal-body">
            <form id="login_modal_form" onSubmit={formik.handleSubmit}>
              <div className="form-group">
                <span>
                  {intl.get('username')}
                  :
                </span>
                <input className="form-control" id="login_modal_username_input" type="text" name="username" {...formik.getFieldProps('username')} />
              </div>
              <div className="form-group">
                <span>
                  {intl.get('password')}
                  :
                </span>
                <input className="form-control" id="login_modal_password_input" type="password" name="password" {...formik.getFieldProps('password')} />
              </div>
              <div className="form-group action-row">
                {formik.isSubmitting && (
                  <div className="miniLoader" />
                )}
                {showForgotPasswordLink && (
                  <button type="button" className="label-link" onClick={handleResetPasswordClicked}>
                    {intl.get('forgot-password')}
                  </button>
                )}
                <div className="form-input btn-container">
                  <button className="ep-btn primary btn-auth-login" id="login_modal_login_button" type="submit" disabled={formik.isSubmitting}>
                    {intl.get('login')}
                  </button>
                  <Link to={registrationLink}>
                    <button className="ep-btn btn-auth-register" id="login_modal_register_button" type="button" onClick={() => props.handleModalClose()}>
                      {intl.get('register')}
                    </button>
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AppModalLoginMain;
