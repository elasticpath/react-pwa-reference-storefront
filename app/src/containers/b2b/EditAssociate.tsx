
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
import './EditAssociate.less';

interface EditAssociateProps {
    associateEmail: string;
    isEditAssociateOpen: boolean;
    rolesSelector: any;
}
interface EditAssociateState {}

export default  class EditAssociate extends React.Component<EditAssociateProps, EditAssociateState> {
    constructor(props: any) {
        super(props);
        this.state={
            isModalOpen: false,
        }
        this.renderRoleSelection = this.renderRoleSelection.bind(this);

    }

    componentWillReceiveProps(nextProps) {
        console.warn(nextProps);
        this.setState({ isModalOpen: nextProps.isEditAssociateOpen });
    }

    isEditAssociateClose(){
        this.setState({ isModalOpen: false })
    }
    renderRoleSelection(){
        const { rolesSelector } = this.props;
        console.log(rolesSelector);
        if (rolesSelector && rolesSelector._choice && rolesSelector._chosen){
            const chosenRoles = [{name: "", role:""}];
            const choiceRoles = [];
            const roleName = {};
            const allAssociateRoles = [];
            // rolesSelector._choice.map(choiceElement => {
            //     choiceRoles.push(name: choiceElement._description[0].name, url: )
            // })
            // rolesSelector._chosen.map(chosenElement => {
            //     chosenRoles.push(name: chosenElement._description[0].name, url: )
            // })

        }
    }

    handleChangeChk(){

    }


    render () {
        const { rolesSelector, associateEmail } = this.props;
        const { isModalOpen } = this.state;
        const allAssociateRoles = [];

        return (
            <Modal
                open={isModalOpen}
                onClose={() => this.isEditAssociateClose()}
                classNames={{ modal: 'b2b-edit-associate-dialog', closeButton: 'b2b-dialog-close-btn' }}
            >
                <div className="dialog-header">{intl.get('edit-associate')}</div>
                <div className="dialog-content">
                    <div className="associate-email-title">{intl.get('associate-email')}</div>
                    <div className="am-field-editor">
                        <input
                            className="field-editor-input"
                            autoFocus={true}
                            disabled={true}
                            value={associateEmail}
                            onChange={(e) => this.setState({ associateEmail: e.target.value })}
                        />
                    </div>
                    <div className="role-title">{intl.get('role')}</div>
                    {this.renderRoleSelection()}
                    {/*{allAssociateRoles.map(role => (*/}
                        {/*<div key={role} className="role-checkbox">*/}
                            {/*<input type="checkbox" value={intl.get(role) || role}  onChange={this.handleChangeChk} />*/}
                        {/*</div>*/}
                    {/*))}*/}
                </div>
                <div className="dialog-footer">
                    <button className="cancel" type="button" onClick={() => this.isEditAssociateClose()}>{intl.get('cancel')}</button>
                    <button className="upload" type="button">{intl.get('save')}</button>
                </div>
            </Modal>
        )
    }
}
