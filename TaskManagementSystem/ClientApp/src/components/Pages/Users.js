import React, { Component } from 'react';
import axios from 'axios';
import { UserItem } from './Modules/UserItem';
import { UserEditItem } from './Modules/UserEditItem';
import { PasswordModal } from './Modules/PasswordModal';
import { Link } from 'react-router-dom';
import { saveUser} from '../../redux/actions/UserActions';
import { connect } from 'react-redux';

export class Users extends Component {

    constructor(props) {
        super(props);
        this.state = { usersList: [], loaded: false, editUserId: [], modalClass: 'pass-modal-wrapper--closed', currentPassId: '',
        filterData: {
            search: '',
            accountStatus: 'All',
            role: 'All'
        }
    };
        this.updateEditId = this.updateEditId.bind(this);
    }


    componentDidMount() {
        axios.get("api/users").then((response)=>{
            this.setState({ usersList: response.data, loaded: true });
        })
    }

    updateState(response) {
        return (response) => this.setState({ usersList: response.data })
    }

    editUser(id) {
        return (id)=> {
            let editingItems = this.state.editUserId
            editingItems.push(id)
            this.setState({editUserId: editingItems})
        }
    }

    
    sendUser(inputData) {
        
        return (inputData)=> {
            return this.props.dispatch(saveUser({ ...inputData }, () => this.props.history.push('/users')));
        }   
    }

    updateEditId(id) {
        return(id)=> {
            let arr = this.state.editUserId.map((element)=>{
                if(element !== id) {
                    return element
                }
            })
            
    
            this.setState({editUserId: arr})
        }
    }

    openModal() {
        return ()=>{
            let openClass = 'pass-modal-wrapper'
            document.getElementsByTagName('body')[0].style.cssText = 'overflow: hidden'

            this.setState({modalClass: openClass})
        }
    }

    closeModal() {
        return ()=>{
            let closeClass = 'pass-modal-wrapper--closed'
            document.getElementsByTagName('body')[0].style.cssText = 'overflow: auto'

            this.setState({modalClass: closeClass})
        }
    }

    sendId(id) {
        return (id)=>{
            this.setState({currentPassId: id})
        }
    }

    sendPass(pass) {
        return (pass)=>{
            let sendArr = {
                id: this.state.currentPassId,
                password: pass,
                name: this.state.usersList[this.state.currentPassId - 1].name,
                login: this.state.usersList[this.state.currentPassId - 1].login,
                email: this.state.usersList[this.state.currentPassId - 1].email,
                accountStatus: this.state.usersList[this.state.currentPassId - 1].accountStatus,
                role: this.state.usersList[this.state.currentPassId - 1].role
            }
    
            /*axios.put("api/users", JSON.stringify(sendArr), { headers: { 'Content-Type': 'application/json' } }).then((response)=>{
                console.log(response)
            })*/
            this.props.dispatch(saveUser({ ...sendArr }, () => this.props.history.push('/users')));
        }

    }

    renderUsers(search, accountStatus, role) {

        if (this.state.loaded) {
            /*let arr = []

            for (let i = 0; i < this.state.usersList.length; i++) {

                let isEdited = false;

                for (let n = 0; n < this.state.editUserId.length; n++) {
                    if (this.state.usersList[i].id === this.state.editUserId[n]) {
                        isEdited = true
                    }
                }
                
                if (!isEdited) {
                    arr.push(<UserItem edit={this.editUser()} key={this.state.usersList[i].id} userData={this.state.usersList[i]} />)
                } else {
                    arr.push(<UserEditItem sendId={this.sendId()} openModal={this.openModal()} updateState={this.updateState()} sendUser={this.sendUser()} clearEdit={this.updateEditId()} key={this.state.usersList[i].id} userData={this.state.usersList[i]} />)
                }
            }
            return arr*/
            let resultArr = []
            let searchArray = []

            if (search.length === 0) {
                searchArray = [...this.state.usersList]
            }

            
            
            for (let i = 0; i < this.state.usersList.length; i++) {

                let item = <UserItem edit={this.editUser()} key={this.state.usersList[i].id} userData={this.state.usersList[i]} />
                let editedItem = <UserEditItem sendId={this.sendId()} openModal={this.openModal()} updateState={this.updateState()} sendUser={this.sendUser()} clearEdit={this.updateEditId()} key={this.state.usersList[i].id} userData={this.state.usersList[i]} />
                
                let isEdited = false;

                for (let n = 0; n < this.state.editUserId.length; n++) {
                    if (this.state.usersList[i].id === this.state.editUserId[n]) {
                        isEdited = true
                    }
                }

                if (search.length > 0) {
                    if (this.state.usersList[i].id === parseInt(search)) {
                        searchArray.push(this.state.usersList[i])
                        continue
                    }

                    if (this.state.usersList[i].name.slice(0, search.length).toLowerCase() === search.toLowerCase() || this.state.usersList[i].login.slice(0, search.length).toLowerCase() === search.toLowerCase() || this.state.usersList[i].email.slice(0, search.length).toLowerCase() === search.toLowerCase()) {
                        searchArray.push(this.state.usersList[i])
                        continue
                    }
                }



                if (role === 'All' && accountStatus === 'All' && search.length === 0) {
                    if (!isEdited) {
                        resultArr.push(item)
                    } else {
                        resultArr.push(editedItem)
                    }
                }
               
                    
                
                
            }
            for (let n = 0; n < searchArray.length; n++) {

                let isEdited = false;

                for (let y = 0; y < this.state.editUserId.length; y++) {
                    if (searchArray[n].id === this.state.editUserId[y]) {
                        isEdited = true
                    }
                }

                let item = <UserItem edit={this.editUser()} key={this.state.usersList[n].id} userData={searchArray[n]} />
                let editedItem = <UserEditItem sendId={this.sendId()} openModal={this.openModal()} updateState={this.updateState()} sendUser={this.sendUser()} clearEdit={this.updateEditId()} key={searchArray[n].id} userData={searchArray[n]} />
                
                if (role === 'All' && accountStatus == 'All' && search.length > 0) {
                    
                    isEdited ? resultArr.push(editedItem) : resultArr.push(item)

                }

                if (role === 'All' && accountStatus !== 'All') {
                    
                    if (searchArray[n].accountStatus === accountStatus) {
                        isEdited ? resultArr.push(editedItem) : resultArr.push(item)
                    }
                }
                if (role !== 'All' && accountStatus === 'All') {
                    if (searchArray[n].role === role) {
                        isEdited ? resultArr.push(editedItem) : resultArr.push(item)
                    }
                }
                if (role !== 'All' && accountStatus !== 'All') {
                    console.log(searchArray[n].accountStatus, accountStatus)
                    if (searchArray[n].role === role && searchArray[n].accountStatus === accountStatus) {
                        isEdited ? resultArr.push(editedItem) : resultArr.push(item)
                    }
                }
            }
            return resultArr
        }
    }

    

    render () {return (
        
        <div className={'users-container'}>
            <div className='users-title'>
                        <Link tag={Link} to="/adduser"><button className='users-title__button'>Add New User</button></Link>

                    <div className='users-title__filters-container'>
                        <input className='users-title__search' type='search' placeholder='Search' onChange={(e)=>{
                            let obj = {...this.state.filterData}
                            obj.search = e.target.value
                            this.setState({filterData: obj})
                        }} />
                        <select className='users-title__select' onChange={(e)=>{
                            let obj = {...this.state.filterData}
                            obj.role = e.target.value
                            this.setState({filterData: obj})
                            
                        }}>
                            <option selected disabled hidden>Filter by Role</option>
                            <option value='All'>All</option>
                            <option value='Admin'>Admin</option>
                            <option value='Manager'>Manager</option>
                            <option value='Executor'>Executor</option>
                        </select>
                        <select className='users-title__select' onChange={(e)=>{
                            let obj = {...this.state.filterData}
                            obj.accountStatus = e.target.value
                            this.setState({filterData: obj})
                            
                        }}>
                            <option selected disabled hidden>Filter by Status</option>
                            <option value='All'>All</option>
                            <option value='Active'>Active</option>
                            <option value='Inactive'>Inactive</option>
                        </select>
                    </div>
                </div>
            <PasswordModal sendPass={this.sendPass()} closeModal={this.closeModal()} class={this.state.modalClass} />
            <ul className='users-list'>
                <li className='users-list__item'>
                    <div className='users-list__item-wrapper'>
                        <div className='users-list__item-id'><span>ID</span></div>
                        <div className='users-list__item-name'><span>Name</span></div>
                        <div className='users-list__item-login'><span>Login</span></div>
                        <div className='users-list__item-email'><span>Email</span></div>
                        <div className='users-list__item-role'><span>Role</span></div>
                        <div className='users-list__item-status'><span>Status</span></div>
                        <div className='users-list__item-button-wrapper'><button className='users-list__item-button users-list__button-header'>Edit</button></div>
                    </div>
                </li>
                {this.renderUsers(this.state.filterData.search, this.state.filterData.accountStatus, this.state.filterData.role)}
            </ul>
        </div>
    );}
    
}

const mapStateToProps = (state) => ({
    users: state.UserReducer.users,
    accessToken: state.AuthReducer.accessToken
});

export default connect(mapStateToProps)(Users);