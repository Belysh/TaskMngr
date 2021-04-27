import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import JwtHelper from '../../utils/JwtHelper';
import { connect } from 'react-redux';

class Menu extends Component {
    constructor(props) {
        super(props);
      
    }

    closeMenu(e) {
        this.props.closeMenu()
        e.target.parentElement.classList.remove('menu--opened')
        document.getElementsByTagName('body')[0].style.cssText = 'overflow: auto'

    }

    closeMenuItem(e) {
        this.props.closeMenu()
        document.getElementsByClassName('menu--opened')[0].classList.remove('menu--opened')
        document.getElementsByTagName('body')[0].style.cssText = 'overflow: auto'

    }


    render() {
        const userIsAdmin = JwtHelper.getUserRole(this.props.accessToken) === 'Admin';
        let className = 'menu '

        if(this.props.menuIsOpened) {
            className+='menu--opened'

            document.getElementsByTagName('body')[0].style.cssText = 'overflow: hidden'
        }

        return (
            <div className={className}>
                <img className='pass-modal__cancel-button pass-modal__cancel-button--menu' src='/images/icons/cancel.svg' onClick={(e)=>{
                    this.closeMenu(e)
                }}/>
                <div className='menu__wrapper'>
                    <div className='menu__logo' tag={Link} to="/">
                        <img src='/images/icons/logo.svg'/>
                        <div>TaskManager</div>
                    </div>
                    <ul className='menu__list'>
                        <li className='menu__list-item menu__list-item--dashboard' onClick={(e)=>this.closeMenu(e)}><Link tag={Link} to='/'><span>Dashboard</span></Link></li>
                        <li className='menu__list-item menu__list-item--tasks' onClick={(e)=>this.closeMenu(e)}><Link tag={Link} to='/tasks'><span>Tasks</span></Link></li>
                        {userIsAdmin &&
                            <li className='menu__list-item menu__list-item--users' onClick={(e)=>this.closeMenu(e)}><Link tag={Link} to='/users'><span>Users</span></Link></li>
                        }
                    </ul>
                </div>
            </div>
        
        );
    }
}

const mapStateToProps = (state) => ({
    accessToken: state.AuthReducer.accessToken
});
export default connect(mapStateToProps)(Menu);