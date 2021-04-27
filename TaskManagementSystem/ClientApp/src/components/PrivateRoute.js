import React from 'react';
import { Layout } from './Layout';
import { Route, Redirect } from 'react-router-dom';
import JwtHelper from '../utils/JwtHelper';
import PageNotFound from './PageNotFound';

function PrivateRoute({ component: Component, path, allowedRoles, ...rest }) {
    return (
        <Route {...rest} render={props => {
            const accessToken = localStorage.getItem('accessToken');

            if (!accessToken) {
                return <Redirect to={{ pathname: '/auth/login', state: { from: props.location } }} />
            }

            const userRole = JwtHelper.getUserRole(accessToken);

            if ((allowedRoles && allowedRoles.includes(userRole)) || !allowedRoles) {
                return <Layout><Component {...props} /></Layout>
            }
            else {
                return <PageNotFound />;
            }
        }} />
    );
}

export { PrivateRoute };