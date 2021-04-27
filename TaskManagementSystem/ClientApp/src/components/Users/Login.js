import React from 'react';
import { connect } from 'react-redux';
import { login } from '../../redux/actions/AuthActions';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onInputChanged = this.onInputChanged.bind(this);
        this.state = { userName: '', password: '' };
    }

    onSubmit(event) {
        event.preventDefault();
        this.props.dispatch(login({...this.state}, () => this.props.history.push('/')));
    }

    componentDidMount() {
        if (localStorage.getItem('accessToken')) {
            this.props.history.push('/');
        }
    }

    onInputChanged(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {
        return (
            <div className='container login-container'>
                <div className='row row justify-content-center align-items-center'>
                    <div className='login-form col-md-8'>
                        <h3>Login</h3>
                        <form onSubmit={this.onSubmit}>
                            <div className='form-group'>
                                <input name='userName' type='text' value={this.state.userName} onChange={this.onInputChanged} className='form-control' placeholder='Login' minLength="3" maxLength="30" required />
                            </div>
                            <div className='form-group'>
                                <input name='password' type='password' className='form-control' value={this.state.password} onChange={this.onInputChanged} placeholder='Password' minLength="6" maxLength="30" required />
                            </div>
                            <div className='form-group'>
                                <button type='submit' className='btn btn-success'>Login</button>
                            </div>
                            <div className='form-group'>
                                <a href='auth/register'>Register</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect()(Login);