import axios from 'axios';
import { connect } from 'react-redux';
import React, {Component} from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import UserSearch from './Modules/UserSearch'
import { Route, Redirect } from 'react-router-dom';

class AddTask extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {
                description: '',
                name: '',
                status: 'NEW',
                managerId: 0, 
                executorId: 0
            },
            loaded: false, isEdited: false
        }
    }

    componentDidMount() {
        function getCookie(name) {
            let matches = document.cookie.match(new RegExp(
              "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
            ));
            return matches ? decodeURIComponent(matches[1]) : undefined;
          }
          let obj = {...this.state.data}
          obj.managerId = getCookie('user_id')
          this.setState({data: obj})

          let taskId = this.props.match.params['taskId'];

        if (taskId > 0) {
            axios.get("api/task/" + taskId).then((response)=>{
                let obj = {...this.state.data}
                obj.executorId = response.data.executorId
                obj.name = response.data.name
                obj.description= response.data.description
                this.setState({data: obj, loaded: true, isEdited: true})
            })
        } else {
            this.setState({ loaded: true })
        }
        
    
    }

    renerUsers() {
        if (this.state.loaded) {
            return <UserSearch executorId={this.state.data.executorId} editedId={this.props.match.params['taskId']} setId={this.setId()} />
        }
    }

    setId(executorId) {
        return (executorId)=>{
            let obj = {...this.state.data}
            obj.executorId = executorId
            this.setState({data: obj})
        }
    }
  
    render () {
      return (
        <div className='add-task-container'>
                <div className='add-task__title'>
                    <div className='add-task__title-text'>
                        <span>Name:</span>
                    </div>
                    <input defaultValue={this.state.data.name} className='add-task__title-input' onChange={(e)=>{
                        let obj = {...this.state.data}
                        obj.name = e.target.value
                        this.setState({data: obj})
                    }}/>
                </div>
                {this.renerUsers()}
                <div className='add-task__description'>
                    <div className='add-task__description-text'>
                        <span>Description:</span>
                    </div>
                        <div className='add-task__description-editor'>
                        <CKEditor
                            editor={ ClassicEditor }
                            data={this.state.data.description}
                            onChange={ ( event, editor ) => {
                                let obj = {...this.state.data}
                                //const data = editor.getData();
                                obj.description = editor.getData()
                                this.setState({data: obj})
                            } }
                        />
                    </div>
                </div>
                {this.state.isEdited &&
                <div className='add-task__status'>
                <span className='add-user-form__input-text'>Select status:</span>
                <select className="add-user-form__role-select" onChange={(e)=>{
                    let obj = {...this.state.data}
                    obj.status = e.currentTarget.value
                    this.setState({data: obj})
                    }}>
                    <option value="NEW">NEW</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="ON_HOLD">ON_HOLD</option>
                    <option value="DONE">DONE</option>
                </select>
                </div>
                }
                <div className='add-task__button-container'>
                    <button className='add-task__description-button' onClick={()=>{
                        let obj = {...this.state.data}
                        
                        if (obj.executorId > 0 && obj.name.length > 0 && obj.description.length && this.state.isEdited === false) {
                            console.log(obj)
                            document.getElementsByClassName('add-task__modal')[0].classList.add('add-task__modal--closed')
                            axios.post('api/task/', obj).then((response)=>{
                                console.log(response)
                                this.props.history.push('/tasks')
                            })
                        } if (obj.executorId > 0 && obj.name.length > 0 && obj.description.length && this.state.isEdited) {
                            document.getElementsByClassName('add-task__modal')[0].classList.add('add-task__modal--closed')
                            
                            axios.get("api/task/" + this.props.match.params['taskId']).then((respopnse)=>{
                                let task = respopnse.data
                                task.name = this.state.data.name
                                task.description = this.state.data.description
                                task. managerId = this.state.data.managerId
                                task.executorId = this.state.data.executorId
                                task.status = this.state.data.status
                                axios.put('api/task/', task ).then((response)=>{
                                    console.log(response)
                                    this.props.history.push('/tasks')
                                })
                            })
                        } else {
                            document.getElementsByClassName('add-task__modal')[0].classList.remove('add-task__modal--closed')
                        }
                        
                    }}>Save</button>
                </div>
                <div className='add-task__modal add-task__modal--closed'>Name or description are incorrect</div>
            </div>
      );
    }
}

const mapStateToProps = (state) => ({
    users: state.UserReducer.users,
    accessToken: state.AuthReducer.accessToken
});

export default connect(mapStateToProps)(AddTask);



/*import axios from 'axios';
import { connect } from 'react-redux';

class AddTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            setValue: ''
        }
    }
    
    

    render () {

        return (
            <div className='add-task-container'>
                <div className='add-task__title'>
                    <div className='add-task__title-text'>
                        <span>Name:</span>
                    </div>
                    <input className='add-task__title-input' />
                </div>
                <div className='add-task__title'>
                    <div className='add-task__title-text'>
                        <span>Description</span>
                    </div>
                        
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    users: state.UserReducer.users,
    accessToken: state.AuthReducer.accessToken
});

export default connect(mapStateToProps)(AddTask);
*/