import React, { Component } from 'react';
import axios from 'axios';
import validator from 'validator';
import { AddUserInput } from './Modules/AddUserInput';
import { connect } from 'react-redux';
import { addUser} from '../../redux/actions/UserActions';


class AddUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            inputData: {
                name: '',
                login: '',
                email: '',
                password: '',
                accountStatus: 'Active',
                role: 'Manager'

            },
            validationMesssages: {
                incorrectName: <div key={1} className='add-user-form__validation-results__incorrect'>The Name is incorrect</div>,
                correctName: <div key={2} className='add-user-form__validation-results__correct'>The Name is correct</div>,
                incorrectLogin: <div key={3} className='add-user-form__validation-results__incorrect'>The Login is incorrect</div>,
                correctLogin: <div key={4} className='add-user-form__validation-results__correct'>The Login is correct</div>,
                usedLogin: <div key={5} className='add-user-form__validation-results__incorrect'>The Login is already used</div>,
                incorrectEmail: <div key={6} className='add-user-form__validation-results__incorrect'>The Email is incorrect</div>,
                correctEmail: <div key={7} className='add-user-form__validation-results__correct'>The Email is correct</div>,
                easyPassword: <div key={8} className='add-user-form__validation-results__incorrect'>The Password is too easy</div>,
                correctPassword: <div key={9} className='add-user-form__validation-results__correct'>The Password is correct</div>
            },
            submitButton: <button className='add-user-form__submit-button' onClick={(e)=>{
                e.preventDefault()
                this.sendUser()
            }}>Add User</button>
        }
    }

    formReciveData(type, value) {

        //this.setState({inputData: obj});
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
            }

            this.setState({inputData: obj})
        }
    }

    formValidate() {
        let resultMessages = []
        let passedVerifications = 0
        
        if (this.state.inputData.name.length !== 0) {
            /*switch((validator.isAlpha(this.state.inputData.name, 'en-US') || validator.isAlpha(this.state.inputData.name, 'ru-RU')) && validator.isLength(this.state.inputData.name, {min:3, max: 20})) {
                case true:
                    resultMessages.push(this.state.validationMesssages.correctName)
                    passedVerifications++
                    break;
                case false:
                    resultMessages.push(this.state.validationMesssages.incorrectName)
                    break;
            }*/
            function passed(a) {
                resultMessages.push(a.state.validationMesssages.correctName)
                passedVerifications++
            }

            (validator.isAlpha(validator.blacklist(this.state.inputData.name, ' '), 'en-US') || validator.isAlpha(validator.blacklist(this.state.inputData.name, ' '), 'ru-RU')) && validator.isLength(this.state.inputData.name, {min:3, max: 20}) ? passed(this) : resultMessages.push(this.state.validationMesssages.incorrectName)
        }
        if (this.state.inputData.login.length !== 0) {
            function passed(a) {
                resultMessages.push(a.state.validationMesssages.correctLogin)
                passedVerifications++
            }

            validator.isAlphanumeric(this.state.inputData.login) && this.state.inputData.login.length > 3 ? passed(this) : resultMessages.push(this.state.validationMesssages.incorrectLogin)
        }
        if (this.state.inputData.email.length !== 0) {
            function passed(a) {
                resultMessages.push(a.state.validationMesssages.correctEmail)
                passedVerifications++
            }

            validator.isEmail(this.state.inputData.email) ? passed(this) : resultMessages.push(this.state.validationMesssages.incorrectEmail)
        }
        if (this.state.inputData.password.length !== 0) {
            function passed(a) {
                resultMessages.push(a.state.validationMesssages.correctPassword)
                passedVerifications++
            }

            validator.isStrongPassword(this.state.inputData.password) ? passed(this) : resultMessages.push(this.state.validationMesssages.easyPassword)
        }
        if (passedVerifications === 4) {
            resultMessages.push(this.state.submitButton);
        }

        return resultMessages
    }

    sendUser() {

        this.props.dispatch(addUser({ ...this.state.inputData }, () => this.props.history.push('/users')));
    }

    render () {return (
        <div className='user-wrapper'>
            
            <form className='add-user-form' onSubmit={(e)=>{e.preventDefault()}}>
                <div className='add-user-form__title'>Add User</div>
                <div className='add-user-form__input-wrapper'>
                    <div className='add-user-form__input-wrapper__column'>
                        <span className='add-user-form__input-text'>Name:</span>
                        <AddUserInput validate={this.formReciveData()} inputType={'name'}/>
                    </div>
                </div>
                <div className='add-user-form__input-wrapper'>
                    <div className='add-user-form__input-wrapper__column'>
                        <span className='add-user-form__input-text'>Login:</span>
                        <AddUserInput validate={this.formReciveData()} inputType={'login'}/>
                    </div>
                </div>
                <div className='add-user-form__input-wrapper'>
                    <div className='add-user-form__input-wrapper__column'>
                        <span className='add-user-form__input-text'>Email:</span>
                        <AddUserInput validate={this.formReciveData()} inputType={'email'}/>
                    </div>
                </div>
                <div className='add-user-form__input-wrapper'>
                    <div className='add-user-form__input-wrapper__column'>
                        <span className='add-user-form__input-text'>Password:</span>
                        <AddUserInput validate={this.formReciveData()} inputType={'password'}/>
                    </div>
                </div>
                <div className='add-user-form__input-wrapper'>
                    <div className='add-user-form__input-wrapper__column'>
                        <span className='add-user-form__input-text'>Select Role:</span>
                        <select className="add-user-form__role-select" onChange={(e)=>{
                            let obj = {...this.state.inputData}
                            obj.role = e.target.value
                            this.setState({inputData: obj})
                        }}>
                            <option value="Manager">Manager</option>
                            <option value="Executor">Executor</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                </div>
                <div className='add-user-form__input-wrapper'>
                    <div className='add-user-form__input-wrapper__column'>
                        <span className='add-user-form__input-text'>Select status:</span>
                        <select className="add-user-form__role-select" onChange={(e)=>{
                            let obj = {...this.state.inputData}
                            obj.accountStatus = e.currentTarget.value
                            this.setState({inputData: obj})
                        }}>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>
                <div className='add-user-form__validation-results'>
                    {this.formValidate()}
                </div>
            </form>
        </div>
    );}
    
}

const mapStateToProps = (state) => ({
    users: state.UserReducer.users,
    accessToken: state.AuthReducer.accessToken
});

export default connect(mapStateToProps)(AddUser);