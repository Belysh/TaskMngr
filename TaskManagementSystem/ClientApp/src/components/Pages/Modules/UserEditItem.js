import React, { Component } from 'react';
import { EditUserInput } from './EditUserInput';
import { EditUserSelect } from './EditUserSelect';
import validator from 'validator';
import axios from 'axios';

export class UserEditItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            inputData: {
                id: this.props.userData.id,
                name: this.props.userData.name,
                login: this.props.userData.login,
                email: this.props.userData.email,
                accountStatus: this.props.userData.accountStatus,
                role: this.props.userData.role

            },
            isCorrect: {
                name: true,
                login: true,
                email: true
            }
        }
    }

    saveData(type, value) {

        return (type, value)=> {
            let obj = {...this.state.inputData}
            
            switch (type) {
                case 'name':
                    obj.name = value
                    break
                case 'login':
                    obj.login = value
                    break
                case 'email':
                    obj.email = value
                    break
                case 'password':
                    obj.password = value
                    break
                case 'role':
                    obj.role = value
                    break
                case 'status':
                    obj.accountStatus= value
                    break
            }

            this.setState({inputData: obj}, () => {
                let obj = {
                    name: this.state.isCorrect.name,
                    login: this.state.isCorrect.login,
                    email: this.state.isCorrect.email
                }
        
                if (this.state.inputData.name.length !== 0) {
                    (validator.isAlpha(validator.blacklist(this.state.inputData.name, ' '), 'en-US') || validator.isAlpha(validator.blacklist(this.state.inputData.name, ' '), 'ru-RU')) && validator.isLength(this.state.inputData.name, {min:3, max: 20}) ? obj.name = true : obj.name = false
                }
                if (this.state.inputData.login.length !== 0) {
                    validator.isAlphanumeric(this.state.inputData.login) && this.state.inputData.login.length > 3 ? obj.login = true : obj.login = false
                }
                if (this.state.inputData.email.length !== 0) {
                    validator.isEmail(this.state.inputData.email) ? obj.email = true : obj.email = false
                }
        
                
                this.setState({isCorrect: obj, })
            })
        }

    }


    render () {return (
        <li className='users-list__item'>
            <div className='users-list__item-wrapper'>
                <div className='users-list__item-id'><span>#{this.props.userData.id}</span></div>
                <div className='users-list__item-name'><EditUserInput isCorrect={this.state.isCorrect.name} /*formValidate={this.formValidate()}*/ inputType={'name'} saveData={this.saveData()} value={this.props.userData.name} /></div>
                <div className='users-list__item-login'><EditUserInput isCorrect={this.state.isCorrect.login} /*formValidate={this.formValidate()}*/ inputType={'login'} saveData={this.saveData()} value={this.props.userData.login}/></div>
                <div className='users-list__item-email'><EditUserInput isCorrect={this.state.isCorrect.email} /*formValidate={this.formValidate()}*/ inputType={'email'} saveData={this.saveData()} value={this.props.userData.email}/></div>
                <div className='users-list__item-role'>
                    <EditUserSelect inputType={'role'} saveData={this.saveData()} currOption={this.props.userData.role} optionStack={['Manager', 'Executor', 'Admin']}/>
                </div>
                <div className='users-list__item-status'>
                    <EditUserSelect inputType={'status'} saveData={this.saveData()} currOption={this.props.userData.accountStatus} optionStack={['Active', 'Inactive']}/>
                </div>
                <div className='users-list__item-button-wrapper'>
                    <img className='users-list__item-password-button' src='/images/icons/password.svg' onClick={()=>{
                        this.props.openModal()
                        this.props.sendId(this.props.userData.id)
                    }}/>
                    <img className='users-list__item-save-button' src='/images/icons/save.svg' onClick={
                        (e)=>{
                            if(this.state.isCorrect.name && this.state.isCorrect.login && this.state.isCorrect.email) {
                                this.props.sendUser(this.state.inputData).then(()=>{
                                    axios.get("api/users").then((response)=>{
                                        this.props.updateState(response)
                                        this.props.clearEdit(this.props.userData.id)
                                    })
    
                                })
                            }
                            
                            //
                        }
                    }/>
                    <img className='users-list__item-cancel-button' src='/images/icons/cancel.svg' onClick={()=>this.props.clearEdit(this.props.userData.id)}/>
                </div>
            </div>
        </li>
    );}
}