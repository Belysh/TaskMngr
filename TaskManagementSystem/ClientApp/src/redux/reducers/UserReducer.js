import CONSTANTS from '../constants';

const initialState = { users: [], user: {} };

export default function (state = initialState, action) {
    switch (action.type) {
        case CONSTANTS.GET_USER_SUCCESSFULL:
            return { ...state, user: action.data };
        case CONSTANTS.GET_USERS_SUCCESSFULL:
            return { ...state, users: action.data };
        case CONSTANTS.GET_USERS_FAILED:
            return { ...state, users: [] };
        case CONSTANTS.ADD_USER_SUCCESSFULL:
            return { ...state, users: [...state.users, action.data] };
        case CONSTANTS.ADD_USER_FAILED:
        case CONSTANTS.SAVE_USER_SUCCESSFULL:
        case CONSTANTS.CANCEL_USER_SAVE:
        case CONSTANTS.DELETE_USER_SUCCESSFULL:
            return { ...state, user: {} };
        case CONSTANTS.SAVE_USER_FAILED:
            return { ...state };
        case CONSTANTS.DELETE_USER_FAILED:
            return { ...state };
        default:
            return state;
    }
}