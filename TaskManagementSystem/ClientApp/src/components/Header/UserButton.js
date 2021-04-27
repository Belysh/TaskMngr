import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { log_out } from '../../redux/actions/AuthActions';
import { getUser } from '../../redux/actions/UserActions';
import JwtHelper from '../../utils/JwtHelper';
import axios from 'axios';

class UserButton extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: ''
        }
        this.logOut = this.logOut.bind(this);
    }

    getCookie(name) {
        let matches = document.cookie.match(new RegExp(
          "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    logOut() {
        this.props.dispatch(log_out());
    }

    render() {
        console.log(this.getCookie('user_login'))
        return (
            <div className='user-button' onClick={(e) => {
                e.currentTarget.getElementsByClassName('user-button__list-wrapper')[0].classList.toggle('user-button__list-wrapper--disabled')
                e.currentTarget.getElementsByClassName('user-button__block')[0].classList.toggle('user-button__block--active')

            }}>
                <div className='user-button__block'>
                    <div className='user-button__login'>{this.getCookie('user_login')}</div>
                    <div className='user-button__avatar'><img src='/images/icons/user.svg'></img></div>
                </div>
                <div className='user-button__list-wrapper user-button__list-wrapper--disabled'>
                    <ul className='user-button__list'>
                        <li className='user-button__list-item'><Link tag={Link} to='/'>Home</Link></li>
                        <li className='user-button__list-item'><Link tag={Link} to='/profile'>Profile</Link></li>
                        <li className='user-button__list-item' onClick={this.logOut}><a>Logout</a></li>
                    </ul>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    accessToken: state.AuthReducer.accessToken,
    refreshToken: state.AuthReducer.refreshToken
});
export default connect(mapStateToProps)(UserButton);