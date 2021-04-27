import axios from 'axios';
import { connect } from 'react-redux';
import React, {Component} from 'react';

class UserSearch extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {
                executorId: 0
            },
            usersList: [],
            loaded: false,
            search: ''
        }
    }

    componentDidMount() {
        axios.get("api/users").then((response)=>{
            this.setState({ usersList: response.data, loaded: true })
        }).then(()=>{
            
            if (parseInt(this.props.editedId) > 0) {  
                console.log(this.props.executorId, this.state.usersList.length)
                for (let i = 0; i < this.state.usersList.length; i++) {
                    if (this.state.usersList[i].id === this.props.executorId) {
                        
                        this.setState({search: this.state.usersList[i].login})
                        document.getElementsByClassName('add-task__user-search-input')[0].setAttribute("disabled", "disabled")
                        document.getElementsByClassName('add-task__user-search-list')[0].firstChild.style.cssText = 'display: none'
                    }
                }
            }
        })
    }

    chooseUser(id, login) {
        this.setState({search: login})
        let obj = {...this.state.data}
        obj.executorId = id
        this.setState({data: obj}, console.log(this.state))
    }

    renderUsers(search) {

        if (this.state.loaded) {

            let resultArr = []
            
            for (let i = 0; i < this.state.usersList.length; i++) {

                let item = <li login={this.state.usersList[i].login}  key={this.state.usersList[i].id} onClick={(e)=>{
                    this.chooseUser(this.state.usersList[i].id, this.state.usersList[i].login)
                    e.target.style.cssText = 'display: none'
                    document.getElementsByClassName('add-task__user-search-input')[0].setAttribute("disabled", "disabled");
                    this.props.setId(this.state.usersList[i].id)
                }}>{this.state.usersList[i].login + ' (Email: ' + this.state.usersList[i].email + '; Name: ' + this.state.usersList[i].name + ')'}</li>

                if (search.length !==0 && this.state.usersList[i].role === 'Executor') {
                    if (this.state.usersList[i].name.slice(0, search.length).toLowerCase() === search.toLowerCase() || this.state.usersList[i].login.slice(0, search.length).toLowerCase() === search.toLowerCase() || this.state.usersList[i].email.slice(0, search.length).toLowerCase() === search.toLowerCase()) {
                        resultArr.push(item )
                        continue
                    }
                }
            }
            return resultArr
        }
    }
  
    render () {
      return (
        <div className='add-task__user-search-container'>
            <span>Executor:</span>
            <input value={this.state.search} className='add-task__user-search-input' onChange={(e)=>{
                this.setState({search: e.target.value})
                
            }}></input>
            <button onClick={()=>{
                document.getElementsByClassName('add-task__user-search-input')[0].removeAttribute("disabled");
                this.setState({search: ''})
                let obj = {...this.state.data}
                obj.executorId = 0
                this.setState({data: obj})
            }}>Clear</button>
            <ul className='add-task__user-search-list'>
                {this.renderUsers(this.state.search)}
            </ul>
        </div>
      );
    }
}

const mapStateToProps = (state) => ({
    users: state.UserReducer.users,
    accessToken: state.AuthReducer.accessToken
});

export default connect(mapStateToProps)(UserSearch);