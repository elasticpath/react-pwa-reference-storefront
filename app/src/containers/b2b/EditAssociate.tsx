
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

import * as React from 'react';
import * as intl from "react-intl-universal";
import Modal from "react-responsive-modal";
import {adminFetch} from "../../utils/Cortex";
import * as Config from '../../ep.config.json';

import './EditAssociate.less';

interface EditAssociateProps {
    isOpen: boolean,
    handleClose: () => void,
    handleUpdate: () => void,
    associateEmail: string,
    accountName: string,
    rolesSelector: any,
    isSelf: boolean,
}

interface EditAssociateState {
    changedRoles: any,
    isLoading: boolean,
}

export default  class EditAssociate extends React.Component<EditAssociateProps, EditAssociateState> {
    constructor(props: any) {
        super(props);
        this.state={
            changedRoles: [],
            isLoading: false,
        };
        this.renderRoleSelection = this.renderRoleSelection.bind(this);
        this.handleRoleChange= this.handleRoleChange.bind(this);
        this.handleSaveClicked= this.handleSaveClicked.bind(this);
    }

    renderRoleSelection(){
        const { rolesSelector, isSelf } = this.props;

        if (rolesSelector){
            const allAssociateRoles = [];
            if (rolesSelector._choice) {
                rolesSelector._choice.forEach(choiceElement => {
                    allAssociateRoles.push({
                        roleName: choiceElement._description[0].name,
                        selectRoleURI: choiceElement._selectaction[0].self.uri,
                        selected: false
                    })
                });
            }
            if(rolesSelector._chosen) {
                rolesSelector._chosen.forEach(chosenElement => {
                    allAssociateRoles.push({
                        roleName: chosenElement._description[0].name,
                        selectRoleURI: chosenElement._selectaction[0].self.uri,
                        selected: true
                    })
                });
            }
            allAssociateRoles.sort(function (a, b) {
                if (a.roleName > b.roleName) {
                    return 1;
                }
                if (a.roleName < b.roleName) {
                    return -1;
                }
                return 0;
            });

            return (
                <div>
                    {allAssociateRoles.map(role => (
                    <div key={role.roleName} className="role-checkbox">
                        <input id={role.roleName} disabled={isSelf && role.roleName === 'BUYER_ADMIN'} type="checkbox" defaultChecked={role.selected} onChange={() => this.handleRoleChange(role)} className="style-checkbox" />
                        <label htmlFor={role.roleName} />
                        <label htmlFor={role.roleName} className="role-title">{intl.get(role.roleName.toLowerCase()) || role.roleName}</label>
                    </div>
                    ))}
                </div>
            );
        }
    }

    handleRoleChange(role) {
        const { changedRoles } = this.state;

            const changes = changedRoles;
            const roleIndex = changes.findIndex(r => r.roleName === role.roleName);
            if (roleIndex !== -1) {
                changes.splice(roleIndex, 1);
            } else {
                changes.push(role);
            }
            this.setState({changedRoles: changes})
    }

    handleSaveClicked() {
        const { changedRoles } = this.state;
        const { handleClose, handleUpdate } = this.props;
        if (!changedRoles.length) {
            handleClose();
            return;
        }
        this.setState({ isLoading: true });
        changedRoles.forEach(selection => {
            adminFetch(`${selection.selectRoleURI}?followlocation&format=standardlinks,zoom.nodatalinks`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
                },
                body: JSON.stringify({}),
            })
            .then(res => res.json())
            .then(() => {
                this.setState({isLoading: false});
                handleClose();
                handleUpdate();
            })
            .catch(() => {
                this.setState({isLoading: false})
            });
        })
    }

    render () {
        const { associateEmail, handleClose, isOpen, accountName } = this.props;
        const { isLoading } = this.state;

        return (
            <Modal
                open={isOpen}
                onClose={handleClose}
                classNames={{ modal: 'b2b-edit-associate-dialog', closeButton: 'b2b-dialog-close-btn' }}
            >
                <div className="dialog-header">{intl.get('edit-associate')}</div>
                <div className="dialog-content">
                    <div className="am-columns">
                        <div className="am-field-editor">
                            <div className="associate-email-title">{intl.get('associate-email')}</div>
                            <input
                                className="field-editor-input"
                                autoFocus={true}
                                disabled={true}
                                value={associateEmail}
                                onChange={(e) => this.setState({ associateEmail: e.target.value })}
                            />
                        </div>
                        <div>
                            <div className="account-title">{intl.get('account')}</div>
                            <p>{accountName}</p>
                        </div>
                    </div>
                    <div className="checkbox-role-title">{intl.get('role')}</div>
                    {this.renderRoleSelection()}
                </div>
                <div className="dialog-footer">
                    <button className="cancel" type="button" onClick={handleClose}>{intl.get('cancel')}</button>
                    <button className="upload" type="button" onClick={() => this.handleSaveClicked()}>{intl.get('save')}
                    </button>
                </div>
                {isLoading ? (
                    <div className="loader-wrapper">
                        <div className="miniLoader" />
                    </div>
                ) : ''}
            </Modal>
        )
    }
}
