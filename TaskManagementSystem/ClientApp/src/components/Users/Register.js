import React from 'react';
import axios from 'axios';
import { User } from './UsersList';
import { renderNotification } from '../../utils/NotificationHelper';

export class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = { title: '', user: new User() };
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        let newUser = {};

        formData.forEach(function (value, key) {
            newUser[key] = value;
        });

        axios.post('api/auth/register', JSON.stringify(newUser), { headers: { 'Content-Type': 'application/json' } })
            .then(response => {
                this.props.history.push('/auth/login');
                renderNotification('Registration successful', response.data, 'success');
            }).catch(error => {
                if (error.response.status === 400 && error.response.data.title === 'One or more validation errors occurred.') {
                    for (const e in error.response.data.errors) {
                        renderNotification('Error', error.response.data.errors[e][0], 'danger');
                    }
                } else {
                    let errorMessage = error.response.status === 400 ?
                        error.response.data :
                        "An error occured while registering the user. Try later.";

                    renderNotification('Error', errorMessage, 'danger');
                }
            });
    }

    render() {
        return (
            <div className='container login-container'>
                <div className='row row justify-content-center align-items-center'>
                    <div className='login-form col-md-8'>
                        <h3>Register</h3>
                        <form onSubmit={this.onSubmit}>
                            <div className='form-group'>
                                <input name='login' type='text' className='form-control' placeholder='Login' minLength="3" maxLength="30" required />
                            </div>
                            <div className='form-group'>
                                <input name='name' type='text' className='form-control' placeholder='Name' minLength="3" maxLength="80" required />
                            </div>
                            <div className='form-group'>
                                <input name='email' type='email' className='form-control' placeholder='Email' required />
                            </div>
                            <div className='form-group'>
                                <input name='password' type='password' className='form-control' placeholder='Password' minLength="6" maxLength="30" required />
                            </div>
                            <div className='form-group'>
                                <button type='submit' className='btn btn-success'>Register</button>
                            </div>
                            <div className='form-group'>
                                <a href='auth/login'>Login</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
