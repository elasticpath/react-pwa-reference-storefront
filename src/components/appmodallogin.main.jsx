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
import { loginRegistered } from '../utils/AuthService.js';
import { withRouter } from 'react-router-dom';

var Config = require('Config')

class AppModalLoginMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            failedLogin: false,
            isLoading: false
        };
        this.setUsername = this.setUsername.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.loginRegisteredUser = this.loginRegisteredUser.bind(this);
    }
    setUsername(event) {
        this.setState({ username: event.target.value });
    }
    setPassword(event) {
        this.setState({ password: event.target.value });
    }
    loginRegisteredUser(event) {
        this.setState({ isLoading: true });
        if (localStorage.getItem(Config.cortexApi.scope + '_oAuthRole') === 'PUBLIC') {
            loginRegistered(this.state.username, this.state.password).then(res_status => {
                if (res_status === 401) {
                    this.setState({
                        failedLogin: true,
                        isLoading: false
                    });
                }
                if (res_status === 400) {
                    this.setState({
                        failedLogin: true,
                        isLoading: false
                    });
                }
                else if (res_status === 200) {
                    this.setState({ failedLogin: false });
                    document.getElementById("login_modal_close_button").click();
                    this.props.history.push('/');
                }
            });
            event.preventDefault();
        }
    }
    registerNewUser(event) {
        if (document.getElementById("login_modal_close_button")) {
            document.getElementById("login_modal_close_button").click();
        }
    }
    render() {
        return (
            <div className="modal" id="login-modal">
                <div className="modal-dialog">
                    <div className="modal-content" id="simplemodal-container">

                        <div className="modal-header">
                            <h2 className="modal-title">Login</h2>
                            <button type="button" id="login_modal_close_button" className="close" data-dismiss="modal">&times;</button>
                        </div>

                        <div className="auth-feedback-container" id="login_modal_auth_feedback_container" data-region="authLoginFormFeedbackRegion" data-i18n="">{this.state.failedLogin ? ('Your username or password is invalid.') : ('')}</div>

                        <div className="modal-body">
                            <form ref="form" id="login_modal_form" onSubmit={this.loginRegisteredUser}>
                                <div className="form-group">
                                    <label>Username:</label>
                                    <input className="form-control" id="login_modal_username_input" type="text" onChange={this.setUsername} />
                                </div>
                                <div className="form-group">
                                    <label>Password:</label>
                                    <input className="form-control" id="login_modal_password_input" type="password" onChange={this.setPassword} />
                                </div>
                                <div className="form-group action-row">
                                    {
                                        (this.state.isLoading) ? <div className="miniLoader" /> : ("")
                                    }
                                    <div className="login-cell">
                                        <button className="btn-auth-login" id="login_modal_login_button" data-cmd="login" data-toggle="collapse" data-target=".navbar-collapse" type="submit">Login</button>
                                    </div>
                                    <div className="register-cell">
                                        <Link to="/registration">
                                            <button className="btn-auth-register btn btn-link" id="login_modal_register_button" data-toggle="collapse" data-target=".navbar-collapse" onClick={this.registerNewUser}>Register</button>
                                        </Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(AppModalLoginMain);