import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import TasksList from './Modules/TasksList'
import JwtHelper from '../../utils/JwtHelper'
import { Link } from 'react-router-dom';

class Tasks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filterData: {
                id: 0,
                status: 'ALL'
            }
        }
    }
    
    goTo(id) {
        return (id)=>{
            this.props.history.push('/task/edit/' + id);
        }
    }

    render () {
        const userIsManager = JwtHelper.getUserRole(this.props.accessToken) === 'Manager';
        const userNotAdmin = JwtHelper.getUserRole(this.props.accessToken) === 'Manager' || JwtHelper.getUserRole(this.props.accessToken) === 'Executor';

        return (
            <div className='tasks-container'>
                <div className='tasks-title'>
                    <div>
                    {userIsManager &&
                        <Link tag={Link} to={'/task/add'}><button className='tasks-title__button'>Add New Task</button></Link>
                    }
                    {userNotAdmin &&
                        <button className='tasks-title__button tasks-title__button--file' onClick={()=>{
                            axios.get('/api/tasks/export').then((response)=>{
                                console.log(response)
                            })
                        }}>Export to CSV</button>
                    }
                    </div>
                    <div>
                        <input className='tasks-title__search' type='search' placeholder='Search task by ID' onChange={(e)=>{
                            let obj = {...this.state.filterData}
                            obj.id = e.target.value
                            this.setState({filterData: obj})
                        }} />
                        <select className='tasks-title__select' onChange={(e)=>{
                            let obj = {...this.state.filterData}
                            obj.status = e.target.value
                            this.setState({filterData: obj})
                            
                        }}>
                            <option selected disabled hidden>Filter by Status</option>
                            <option value='ALL'>All</option>
                            <option value='NEW'>New</option>
                            <option value='IN_PROGRESS'>In progress</option>
                            <option value='ON_HOLD'>On hold</option>
                            <option value='DONE'>Done</option>
                        </select>
                    </div>
                </div>
                <TasksList goTo={this.goTo()} filterId={this.state.filterData.id} status={this.state.filterData.status} />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    users: state.UserReducer.users,
    accessToken: state.AuthReducer.accessToken
});

export default connect(mapStateToProps)(Tasks);