import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { getUser } from '../../../redux/actions/UserActions';
import parse from 'html-react-parser';

class TasksItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isResized: false
        }
    }

    render () {
        let className = ''
        switch(this.props.values.status) {
            case 'NEW':
                className = 'tasks-list__item-status--new'
                break;
            case 'IN_PROGRESS':
                className = 'tasks-list__item-status--progress'
                break;
            case 'ON_HOLD':
                className = 'tasks-list__item-status--on-hold'
                break;
            case 'DONE':
                className = 'tasks-list__item-status--done'
                break;
        }

        return (
            <li className={this.props.className}>
                <img className='pass-modal__cancel-button pass-modal__cancel-button--menu' src='/images/icons/settings.svg' onClick={()=>{
                    let id = this.props.values.id
                    this.props.sendId(id)
                    console.log(this.props.values.id)
                }}/>
                <div className='tasks-list__item-container'>
                    <div className='tasks-list__item-header'>
                        
                        <div className='tasks-list__item-title'><div className='tasks-list__item-id'>#{this.props.values.id}</div>{this.props.values.name}</div>
                    </div>
                    <div className='tasks-list__item-status'>
                        Status:<span className={className}>{' ' + this.props.values.status}</span>
                    </div>
                    <div className='tasks-list__item-contributors'>
                        <div className='tasks-list__item-contributors__manager'>Manager:<span>{' ' + this.props.values.manager.login}</span></div>
                        <div className='tasks-list__item-contributors__executor'>Executor:<span>{' ' + this.props.values.executor.login}</span></div>
                    </div>
                    <div className='tasks-list__item-description'>
                        {parse(this.props.values.description)}
                    </div>
                    <div className='tasks-list__item-buttons'>
                        <button className='tasks-list__item-buttons__resize' onClick={(e)=>{
                            //e.target.parentElement.parentElement.parentElement.classList.toggle('tasks-list__item--resized')
                            
                            this.props.resizeTask(this.props.values.id)
                            
                        }}>Resize</button>
                    </div>
                </div>
            </li>
        )
    }
}

const mapStateToProps = (state) => ({
    users: state.UserReducer.users,
    accessToken: state.AuthReducer.accessToken
});

export default connect(mapStateToProps)(TasksItem);