import React, { Component } from 'react';
import { EditPasswordInput } from './EditPasswordInput';
import validator from 'validator';

export class PasswordModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            className: this.props.class,
            validationMesssages: {
                easyPassword: <div key={1} className='add-user-form__validation-results__incorrect'>The Password is too easy</div>,
                correctPassword: <div key={2} className='add-user-form__validation-results__correct'>The Password is correct</div>,
                isMatch: <div key={3} className='add-user-form__validation-results__correct'>The passwords match</div>,
                notMatch: <div key={4} className='add-user-form__validation-results__incorrect'>The passwords don't match</div>
            },
            inputData: {
                password: '',
                repeatPassword: ''
            }
        }
    }

    receivePass(type, value) {
        return (type, value)=> {

        let obj = {...this.state.inputData}

        switch (type) {
            case 'password':
                obj.password = value
                break
            case 'repeatPassword':
                obj.repeatPassword = value
                break
        }

        console.log(obj)
        this.setState({inputData: obj})
    }
    }

    validateData() {
        let resultMessages = []
        let passedVerifications = 0

        // if (this.state.inputData.password.length !== 0) {
        //     validator.isStrongPassword(this.state.inputData.password) ? (resultMessages.push(this.state.validationMesssages.correctPassword), passedVerifications++) : resultMessages.push(this.state.validationMesssages.easyPassword)
        // }

        // if (this.state.inputData.password.length !== 0) {
        //     this.state.inputData.password === this.state.inputData.repeatPassword ? (resultMessages.push(this.state.validationMesssages.isMatch), passedVerifications++) : resultMessages.push(this.state.validationMesssages.notMatch)
        // }

        if (passedVerifications === 2) {
            resultMessages.push(<button className='pass-modal__button' onClick={()=>{

                this.props.sendPass(this.state.inputData.password)
                this.props.closeModal()

            }}>Save</button>);
        }

        return resultMessages
    }

    render() {       

        return ( 
            <div className={this.props.class}>
                 <div className={'pass-modal'}>
                    <div className={'pass-modal__container'}>
                        <img className='pass-modal__cancel-button' src='/images/icons/cancel.svg' onClick={()=>{this.props.closeModal()}}/>
                        <div className='pass-modal__input-container'>
                            <div className='pass-modal__input-wrapper'>
                                <span className='pass-modal__input-text'>New password:</span>
                                <EditPasswordInput receivePass={this.receivePass()} inputType={'password'}/>
                            </div>
                            <div className='pass-modal__input-wrapper'>
                                <span className='pass-modal__input-text'>Repeat password:</span>
                                <EditPasswordInput receivePass={this.receivePass()} inputType={'repeatPassword'}/>
                            </div>
                        </div>
                        {this.validateData()}
                    </div>
                 </div>
            </div>
        )
    }
}