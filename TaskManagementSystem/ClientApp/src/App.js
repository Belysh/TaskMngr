import React, { Component } from 'react';
import { Route, Switch, Router } from 'react-router';
import { Home } from './components/Home';
//import UsersList from './components/Users/UsersList';
import Users from './components/Pages/Users';
import Tasks from './components/Pages/Tasks';
import AddUser from './components/Pages/AddUser';
import AddTask from './components/Pages/AddTask';
import Login from './components/Users/Login';
import PageNotFound from './components/PageNotFound';
import { Register } from './components/Users/Register';
import { Provider, ReactReduxContext } from 'react-redux';
import { PrivateRoute } from './components/PrivateRoute';
import store from './redux/store';
import history from './utils/History';
import { ConnectedRouter } from 'connected-react-router';

import 'react-notifications-component/dist/theme.css'
import './custom.css'
import './main.min.css'

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <Provider store={store}>
                <ConnectedRouter history={history} context={ReactReduxContext}>
                    <Router history={history}>
                        <Switch>
                            <PrivateRoute exact path='/' component={Home} />
                            <PrivateRoute exact path='/users' component={Users} allowedRoles={['Admin']} />
                            <PrivateRoute path='/adduser' component={AddUser} allowedRoles={['Admin']} />
                            <PrivateRoute path='/task/add' component={AddTask} allowedRoles={['Manager']} />
                            <PrivateRoute path='/task/edit/:taskId' component={AddTask} allowedRoles={['Manager']} />
                            <PrivateRoute path='/tasks' component={Tasks} allowedRoles={['Admin', 'Manager', 'Executor']} />
                            <Route path='/auth/login' component={Login} />
                            <Route path='/auth/register' component={Register} />
                            <Route path='*' component={PageNotFound} />
                        </Switch>
                    </Router>
                </ConnectedRouter>
            </Provider>
        );
    }
}
