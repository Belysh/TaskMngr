import * as React from 'react';
import { Link } from 'react-router-dom';
import { getUsers } from '../../redux/actions/UserActions';
import { connect } from 'react-redux';

export class User {
    id = 0;
    name = '';
    login = '';
    password = '';
    email = '';
    role = '';
    accountStatus = '';
}

export class UsersList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { usersList: [], loading: false };
        this.handleEdit = this.handleEdit.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(getUsers());
    }

    handleEdit(id) {
        this.props.history.push('/users/edit/' + id);
    }

    render() {
        let contents = this.state.loading ? <p><em>Loading...</em></p> : this.renderUsersTable(this.props.users);

        return <div>
            <Link to='/users/add'>
                <input type='button' value='Add new user' className='btn btn-success float-left' />
            </Link>
            <br/><br/>
            {contents}
        </div>;
    }

    renderUsersTable(usersList) {
        return <table className='table table-striped'>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Login</th>
                    <th>E-mail</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {usersList.map(user =>
                    <tr key={user.id}>
                        <td className='align-middle'>{user.name}</td>
                        <td className='align-middle'>{user.login}</td>
                        <td className='align-middle'>{user.email}</td>
                        <td className='align-middle'>{user.role}</td>
                        <td className='align-middle'>{user.accountStatus}</td>
                        <td>
                            <input type='button' value='Edit' className='btn btn-primary' onClick={() => this.handleEdit(user.id)} />                            
                        </td>
                    </tr>
                )}
            </tbody>
        </table>;
    }
}

const mapStateToProps = (state) => ({
    users: state.UserReducer.users,
    accessToken: state.AuthReducer.accessToken
});
export default connect(mapStateToProps)(UsersList);