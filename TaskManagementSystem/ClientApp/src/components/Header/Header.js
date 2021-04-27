import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import UserButton from './UserButton';
import MenuButton from './MenuButton';
import JwtHelper from '../../utils/JwtHelper';

export default class Header extends Component {
    constructor(props) {
        super(props);
    }



    render() {
        const userIsAdmin = JwtHelper.getUserRole(this.props.accessToken) === 'Admin';
        return (
            <div className='header'>
                <div className='header__wrapper'>
                    <div><img className='header__menu-button' src='/images/icons/list.svg' onClick={()=>{
                        this.props.openMenu()
                    }}/></div>
                    <UserButton />
                </div>
            </div>
        );
    }
}
