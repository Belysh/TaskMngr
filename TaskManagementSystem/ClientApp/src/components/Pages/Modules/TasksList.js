import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import TasksItem from './TasksItem'

class TasksList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false, tasksList: [], resizeId: 0
        }
    }

    componentDidMount() {
        axios.get("api/task").then((response)=>{
            this.setState({ tasksList: response.data, loaded: true });
            console.log(response.data)
        })
        
    }

    resizeTask(id) {
        return (id)=>{
            this.setState({resizeId: id})
            console.log(id)
        }
    }

    clearResize() {
        return ()=>{
            this.setState({resizeId: 0})
        }
    }

    sendId(id) {
        return (id)=>{
            this.props.goTo(id)
        }
        
        //
    }

    renderResizedTask() {
        
        let task;
        for (let i = 0; i < this.state.tasksList.length; i++) {
            if (this.state.tasksList[i].id === this.state.resizeId) {
                task = this.state.tasksList[i]
            }
        }
        console.log(this.state.tasksList, this.state.resizeId)
        return <TasksItem className='tasks-list__item tasks-list__item--resized' resizeTask={this.clearResize()} values={task} />
    }

    renderTasks(id, status) {
        let resultArr = []
        
        if(this.state.loaded) {
           
            for (let i = 0; i < this.state.tasksList.length; i++) {
                console.log(this.state.tasksList[i])
                let item = <TasksItem sendId={this.sendId()} key={i} className='tasks-list__item' resizeTask={this.resizeTask()} values={this.state.tasksList[i]} />
                if (id > 0) {
                    if (this.state.tasksList[i].id === parseInt(id)) {
                        resultArr.push(item)
                        continue
                    }
                } else if (status !== 'ALL') {
                    if (this.state.tasksList[i].status === status) {
                        resultArr.push(item)
                        continue
                    }
                } else {
                    resultArr.push(item)
               }
            }
        }

        return resultArr
    }

    render () {
        return (
            <ul className='tasks-list'>
                {this.state.resizeId < 1 ? this.renderTasks(this.props.filterId, this.props.status) : this.renderResizedTask()}
            </ul>
        )
    }
}

const mapStateToProps = (state) => ({
    users: state.UserReducer.users,
    accessToken: state.AuthReducer.accessToken
});

export default connect(mapStateToProps)(TasksList);