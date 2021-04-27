import { createStore, applyMiddleware, compose } from 'redux';
import RootReducer from './reducers/RootReducer';
import { refreshToken } from './actions/AuthActions';
import thunk from 'redux-thunk';
import dayjs from 'dayjs';
import JwtHelper from '../utils/JwtHelper';
import history from '../utils/History';

const jwtMiddleware = ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function' && getState().AuthReducer && getState().AuthReducer.accessToken) {
        const accessToken = getState().AuthReducer.accessToken;
        const refrToken = getState().AuthReducer.refreshToken;
        const accessTokenExpiration = JwtHelper.decodeToken(accessToken).exp;

        if (refrToken && accessTokenExpiration && dayjs.unix(accessTokenExpiration).diff(dayjs(), 'minutes') <= 1) {
            return refreshToken(dispatch).then(() => next(action)).catch(() => { });
        }
    }

    return next(action);
};

const middlewares = [jwtMiddleware, thunk];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export default createStore(RootReducer(history), composeEnhancers(applyMiddleware(...middlewares)));