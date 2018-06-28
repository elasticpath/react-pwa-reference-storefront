/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { login } from '../../../utils/AuthService.js';
import { loginRegistered } from '../../../utils/AuthService.js';
import { getRegistrationForm } from '../../../utils/AuthService.js';
import { registerUser } from '../../../utils/AuthService.js';
import { withRouter } from 'react-router';

var Config = require('Config')

class RegistrationFormMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: "",
            lastname: "",
            username: "",
            password: "",
            passwordConfirmation: "",
            registrationURL: "",
            failedLogin: false,
            failedRegistration: false,
            registrationErrors: ''
        };
        this.setFirstName = this.setFirstName.bind(this);
        this.setLastName = this.setLastName.bind(this);
        this.setUsername = this.setUsername.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.setPasswordConfirmation = this.setPasswordConfirmation.bind(this);
        this.registerNewUser = this.registerNewUser.bind(this);
    }
    componentDidMount() {
        login().then(() => {
            getRegistrationForm().then(res_self_href => {
                this.setState({
                    registrationURL: res_self_href
                });
            });
        });
    }
    setFirstName(event) {
        this.setState({ firstname: event.target.value });
    }
    setLastName(event) {
        this.setState({ lastname: event.target.value });
    }
    setUsername(event) {
        this.setState({ username: event.target.value });
    }
    setPassword(event) {
        this.setState({ password: event.target.value });
    }
    setPasswordConfirmation(event) {
        this.setState({ passwordConfirmation: event.target.value });
    }
    registerNewUser(event) {
        login().then(() => {
            registerUser(this.state.lastname, this.state.firstname, this.state.username, this.state.password).then(res => {
                if (res.status === 201) {
                    this.setState({ failedRegistration: false });
                    if (localStorage.getItem(Config.cortexApi.scope + '_oAuthRole') === 'PUBLIC') {
                        loginRegistered(this.state.username, this.state.password).then(res_status => {
                            if (res_status === 401) {
                                this.setState({ failedLogin: true });
                            }
                            if (res_status === 400) {
                                this.setState({ failedLogin: true });
                            }
                            else if (res_status === 200) {
                                if (this.props.location.state.returnPage) {
                                    this.props.history.push(this.props.location.state.returnPage);
                                } else {
                                    this.props.history.push('/');
                                }
                            }
                        });
                    }
                }
                else {
                    this.setState({ failedRegistration: true });
                    var debug_messages = '';
                    res.json().then(function (json) {
                        for (var message in json.messages) {
                            debug_messages = debug_messages.concat('- ' + json.messages[message]['debug-message'] + ' \n ');
                        }
                    }).then(() => this.setState({ registrationErrors: debug_messages }));
                }
            });
        });
    }
    render() {
        return (
            <div className="registration-container container">
                <h3>Register a New Account</h3>

                <div className="feedback-label registration-form-feedback-container feedback-display-linebreak" id="registration_form_feedback_container" data-region="registrationFeedbackMsgRegion">{this.state.failedRegistration ? (this.state.registrationErrors) : ('')}</div>

                <div data-region="registrationFormRegion" style={{ display: 'block' }}><div className="container">
                    <form className="form-horizontal">
                        <div className="form-group">
                            <label data-el-label="registrationForm.firstName" className="control-label registration-form-label">
                                <span className="required-label">*</span> First Name
        </label>
                            <div className="registration-form-input">
                                <input id="registration_form_firstName" name="given-name" className="form-control" type="text" onChange={this.setFirstName} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label data-el-label="registrationForm.lastName" className="control-label registration-form-label">
                                <span className="required-label">*</span> Last Name
        </label>
                            <div className="registration-form-input">
                                <input id="registration_form_lastName" name="family-name" className="form-control" type="text" onChange={this.setLastName} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label data-el-label="registrationForm.emailUsername" className="control-label registration-form-label">
                                <span className="required-label">*</span> Email/Username
        </label>
                            <div className="registration-form-input">
                                <input id="registration_form_emailUsername" name="username" className="form-control" type="text" onChange={this.setUsername} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label data-el-label="registrationForm.password" className="control-label registration-form-label">
                                <span className="required-label">*</span> Password
        </label>
                            <div className="registration-form-input">
                                <input id="registration_form_password" name="password" className="form-control" type="password" onChange={this.setPassword} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label data-el-label="registrationForm.passwordConfirm" className="control-label registration-form-label">
                                <span className="required-label">*</span> Password Confirmation
        </label>
                            <div className="registration-form-input">
                                <input id="registration_form_passwordConfirm" name="passwordConfirm" className="form-control" type="password" onChange={this.setPasswordConfirmation} />
                            </div>
                        </div>
                        <div className="form-group">
                            <input className="btn btn-primary registration-save-btn" id="registration_form_register_button" data-cmd="register" type="button" onClick={this.registerNewUser} value="Submit"></input>
                        </div>
                    </form>
                </div></div>

            </div>
        );
    }
}

export default withRouter(RegistrationFormMain);