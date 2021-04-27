import React, { Component } from 'react';
import axios from 'axios';

export class UserItem extends Component {

    constructor(props) {
        super(props);
    }

    setStatus() {
        if(this.props.userData.accountStatus === 'Active') {
            return <span className='users-list__item-status__active'>{this.props.userData.accountStatus}</span>
        } else return <span className='users-list__item-status__closed'>{this.props.userData.accountStatus}</span>
    }


    render () {return (
        <li className='users-list__item'>
            <div className='users-list__item-wrapper'>
                <div className='users-list__item-id'><span>#{this.props.userData.id}</span></div>
                <div className='users-list__item-name'><span>{this.props.userData.name}</span></div>
                <div className='users-list__item-login'><span>{this.props.userData.login}</span></div>
                <div className='users-list__item-email'><span>{this.props.userData.email}</span></div>
                <div className='users-list__item-role'><span>{this.props.userData.role}</span></div>
                <div className='users-list__item-status'>
                    {
                        this.setStatus()
                    }
                </div>
                <div className='users-list__item-button-wrapper'><button className='users-list__item-button'
                    onClick={()=>{
                        this.props.edit(this.props.userData.id)
                    }}
                >Edit</button></div>
            </div>
        </li>
    );}
}