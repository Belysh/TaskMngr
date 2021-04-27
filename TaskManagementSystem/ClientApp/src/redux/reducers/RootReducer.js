import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import UserReducer from './UserReducer';
import { connectRouter } from 'connected-react-router';

export default (history) => combineReducers({
    AuthReducer, UserReducer, router: connectRouter(history)
})