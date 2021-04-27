import * as React from 'react';
import { User } from './UsersList';
import { getUser, addUser, saveUser, deleteUser, cancelUserSave } from '../../redux/actions/UserActions';
import { connect } from 'react-redux';

export class AddUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = { loading: false, user: new User() };
    }

    componentDidMount() {
        let userId = this.props.match.params['userId'];

        if (userId > 0) {
            this.props.dispatch(getUser(userId));
        }
        else {
            this.setState({ loading: false, user: new User() });
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.user.id === 0 && Object.keys(nextProps.user).length && nextProps.match.params['userId'] > 0) {
            return {
                user: nextProps.user
            }
        }

        return null;
    }

    onInputChanged = (event) => {
        event.persist();
        this.setState((prevState) => ({ user: { ...prevState.user, [event.target.name]: event.target.value }}));
    }

    handleSave = (event) => {
        event.preventDefault();

        if (this.state.user.id) {
            this.props.dispatch(saveUser({ ...this.state.user }, () => this.props.history.push('/users')));
        }
        else {
            this.props.dispatch(addUser({ ...this.state.user }, () => this.props.history.push('/users')));
        }
    }

    handleCancel = (event) => {
        event.preventDefault();

        this.props.dispatch(cancelUserSave(() => this.props.history.push('/users')));
        this.props.history.push('/users');
    }

    handleDelete = (event) => {
        event.preventDefault();        
        this.props.dispatch(deleteUser(this.props.user.id, () => this.props.history.push('/users')));
    }

    render() {
        let contents = this.state.loading ? <p><em>Loading...</em></p> : this.renderCreateForm();

        return <div>
            {contents}
        </div>;
    }

    renderCreateForm = () => {
        return (
            <form onSubmit={this.handleSave} >
                <div className='form-group row' >
                    <label className='control-label col-md-12' htmlFor='name'>Name</label>
                    <div className='col-md-4'>
                        <input className='form-control' type='text' name='name'
                            value={this.state.user.name} onChange={this.onInputChanged} minLength="3" maxLength="80" required />
                    </div>
                </div>
                <div className='form-group row' >
                    <label className='control-label col-md-12' htmlFor='login'>Login</label>
                    <div className='col-md-4'>
                        <input className='form-control' type='text' name='login'
                            value={this.state.user.login} onChange={this.onInputChanged} minLength="3" maxLength="30" required />
                    </div>
                </div>
                <div className='form-group row' >
                    <label className='control-label col-md-12' htmlFor='password'>Password</label>
                    <div className='col-md-4'>
                        <input className='form-control' type='password' name='password'
                            onChange={this.onInputChanged} required={!this.state.user.id} />
                    </div>
                </div>
                <div className='form-group row' >
                    <label className=' control-label col-md-12' htmlFor='email'>E-mail</label>
                    <div className='col-md-4'>
                        <input className='form-control' type='email' name='email'
                            value={this.state.user.email} onChange={this.onInputChanged} required />
                    </div>
                </div>
                <div className='form-group row'>
                    <label className='control-label col-md-12' htmlFor='role'>Role</label>
                    <div className='col-md-4'>
                        <select className='form-control' data-val='true' name='role'
                            value={this.state.user.role} onChange={this.onInputChanged} required>
                            <option value=''>-- Select Role --</option>
                            {(this.state.user.id <= 0 || this.state.user.role === 'Admin') && <option value='Admin'>Admin</option>}
                            <option value='Manager'>Manager</option>
                            <option value='Executor'>Executor</option>
                        </select>
                    </div>
                </div>
                <div className='form-group row'>
                    <label className='control-label col-md-12' htmlFor='accountStatus'>Status</label>
                    <div className='col-md-4'>
                        <select className='form-control' data-val='true' name='accountStatus'
                            value={this.state.user.accountStatus} onChange={this.onInputChanged} required>
                            <option value=''>-- Select account status --</option>
                            <option value='Active'>Active</option>
                            <option value='Inactive'>Inactive</option>
                        </select>
                    </div>
                </div>
                <div className='form-group'>
                    <button type='submit' className='btn btn-success'>Save</button>
                    {(this.state.user.id > 0 || this.state.user.role === 'Admin') &&
                        <button type='submit' className='btn btn-danger' onClick={this.handleDelete}>Delete</button>}                    
                    <button className='btn btn-warning' onClick={this.handleCancel}>Cancel</button>
                </div>
            </form >
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.UserReducer.user
});
export default connect(mapStateToProps)(AddUser);