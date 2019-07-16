import * as React from 'react';
import intl from "react-intl-universal";
import Modal from 'react-responsive-modal';
import { adminFetch } from '../../utils/Cortex';
import { login } from '../../utils/AuthService';
import * as Config from '../../ep.config.json';
import clipboardIcon from '../../images/icons/copy.svg';
import copiedIcon from '../../images/icons/check-circle-filled.svg';
import copy from 'copy-to-clipboard';

import './EditAccount.less';

const COPIED_TIMEOUT_LENGTH = 4000;

interface EditAccountProps {
  isOpen: boolean,
  handleClose: () => void,
  handleUpdate: () => void,
  accountData: {
    name: string,
    legalName: string,
    externalId: string,
    registrationNumber: string,
    selfSignUpCode: string
    uri: string
  }
}

interface EditAccountState {
  name: string,
  legalName: string,
  externalId: string,
  registrationNumber: string,
  isShowingCopied: boolean,
  isLoading: boolean,
}


export default class EditAccount extends React.Component<EditAccountProps, EditAccountState> {
  copiedTimeout?: number;

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      legalName: '',
      externalId: '',
      registrationNumber: '',
      isShowingCopied: false,
      isLoading: false
    };

    this.editAccount = this.editAccount.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { name, legalName, externalId, registrationNumber } = nextProps.accountData;
    this.setState({
      name,
      legalName,
      externalId,
      registrationNumber,
    });

    if (this.copiedTimeout) {
      clearTimeout(this.copiedTimeout);
      this.setState({ isShowingCopied: false });
      this.copiedTimeout = undefined;
    }
  }

  editAccount(event) {
    const { accountData, handleClose, handleUpdate } = this.props;
    const { name, legalName, externalId, registrationNumber } = this.state;

    event.preventDefault();
    this.setState({ isLoading: true });
    login().then(() => {
      adminFetch(`/accounts/am/${accountData.uri}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(`${Config.cortexApi.scope}_oAuthTokenAuthService`),
        },
        body:  JSON.stringify({
          name,
          ['external-id']: externalId,
          ['legal-name']: legalName,
          ['registration-id']: registrationNumber
        })
      })
        .then(() => {
          handleClose();
          handleUpdate();
          this.setState({ isLoading: false });
        })
        .catch(err => {
          console.error(err);
          this.setState({ isLoading: false });
        });
    })
  }

  changeHandler(event) {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({ [name]:value });
  }

  copyToClipboard (text) {
    copy(text);
    this.setState({ isShowingCopied: false }, () => {
      this.setState({ isShowingCopied: true });

      this.copiedTimeout = window.setTimeout(() => {
        this.setState({ isShowingCopied: false });
      }, COPIED_TIMEOUT_LENGTH);
    })
  }

  render() {
    const { isOpen, handleClose, accountData } = this.props;
    const { name, legalName, externalId, registrationNumber, isShowingCopied, isLoading } = this.state;

    return (
      <Modal
        open={isOpen}
        onClose={handleClose}
        classNames={{ modal: 'b2b-edit-account-dialog', closeButton: 'b2b-dialog-close-btn' }}>
        <div className="dialog-header">{intl.get('edit-account')}</div>
        <div className="dialog-content">
          <form onSubmit={this.editAccount}>
            <div className="b2b-form-row">
              <label className="b2b-form-col">
                <p className="b2b-dark-text">{intl.get('name')}</p>
                <input className="b2b-input" value={name || ''} onChange={this.changeHandler} name="name" type="text"/>
              </label>
              <label className="b2b-form-col">
                <p className="b2b-dark-text">{intl.get('legal-name')}</p>
                <input className="b2b-input" value={legalName || ''} onChange={this.changeHandler} name="legalName" type="text"/>
              </label>
            </div>
            <div className="b2b-form-row">
              <label className="b2b-form-col">
                <p className="b2b-dark-text">{intl.get('external-id')}</p>
                <input className="b2b-input" value={externalId || ''} onChange={this.changeHandler} name="externalId" type="text"/>
              </label>
              <label className="b2b-form-col">
                <p className="b2b-dark-text">{intl.get('registration-number')}</p>
                <input className="b2b-input" value={registrationNumber || ''} onChange={this.changeHandler} name="registrationNumber" type="text"/>
              </label>
            </div>
            <div className="b2b-form-row">
              <div className="b2b-form-col">
                <p className="b2b-dark-text">{intl.get('self-sign-up-account-code')}</p>
                {accountData.selfSignUpCode}
              </div>
              <div className="b2b-form-col">
                {isShowingCopied
                  ? (<div className="b2b-copy" onClick={() => this.copyToClipboard(accountData.selfSignUpCode)}>
                    <img src={copiedIcon}/>
                    {intl.get('copied')}
                  </div>)
                  : (<div className="b2b-copy"  onClick={() => this.copyToClipboard(accountData.selfSignUpCode)}>
                    <img src={clipboardIcon}/>
                    {intl.get('copy-to-clipboard')}
                  </div>)
                }
              </div>
            </div>
            <div className="dialog-footer">
              <button className="cancel" type="button" onClick={handleClose}>{intl.get('cancel')}</button>
              <button className="save" disabled={isLoading}>{intl.get('save')}</button>
            </div>
          </form>
        </div>
      </Modal>
    )
  }
}
