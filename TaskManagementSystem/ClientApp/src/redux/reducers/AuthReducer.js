import CONSTANTS from "../constants";
import axios from 'axios';

const initialState = {
    accessToken: localStorage.getItem('accessToken')||null,
    refreshToken: localStorage.getItem('refreshToken')||null,
    user: null
};

if (initialState.accessToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${initialState.accessToken}`;
}

export default function(state = initialState, action) {
    switch (action.type) {
        case CONSTANTS.LOGIN_SUCCESSFULL:
        case CONSTANTS.REFRESH_TOKEN_SUCCESSFULL:
            axios.defaults.headers.common['Authorization'] = `Bearer ${ action.accessToken }`;
            localStorage.setItem('accessToken', action.accessToken);
            localStorage.setItem('refreshToken', action.refreshToken);
            return { ...state, accessToken: action.accessToken, refreshToken: action.refreshToken };
        case CONSTANTS.LOGOUT:
            axios.defaults.headers.common['Authorization'] = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            return { ...state, accessToken: null, refreshToken: null };
        case CONSTANTS.LOGIN_FAILED:
            return {...state };
        default:
            return state;
    }
}