import axios from 'axios';
import { renderNotification } from '../../utils/NotificationHelper';
import CONSTANTS from '../constants';

export const getUsers = () => async dispatch => {
    try {
        const response = await axios.get('api/users');
        dispatch({ type: CONSTANTS.GET_USERS_SUCCESSFULL, data: response.data });
    }
    catch {
        dispatch({ type: CONSTANTS.GET_USERS_FAILED });
        renderNotification('Error', 'An error occured while loading users', 'danger');
    }
}

export const getUser = (id) => async dispatch => {
    try {
        const response = await axios.get('api/users/' + id);
        dispatch({ type: CONSTANTS.GET_USER_SUCCESSFULL, data: response.data });
    }
    catch {
        dispatch({ type: CONSTANTS.GET_USER_FAILED });
        renderNotification('Error', 'An error occured while loading user', 'danger');
    }
}

export const addUser = (newUser, redirect = null) => async dispatch => {
    try {
        const response = await axios.post('api/users', newUser);
        dispatch({ type: CONSTANTS.ADD_USER_SUCCESSFULL, data: response.data });

        if (redirect) {
            redirect();
        }

        renderNotification('Operation completed', 'New user has been created', 'success');
    }
    catch(error) {
        dispatch({ type: CONSTANTS.ADD_USER_FAILED });

        if (error.response.status === 400 && error.response.data.title === 'One or more validation errors occurred.') {
            for (const e in error.response.data.errors) {
                renderNotification('Error', error.response.data.errors[e][0], 'danger');
            }
        } else {
            let errorMessage = error.response.status === 400 ?
                error.response.data :
                "An error occured while adding user. Try later.";

            renderNotification('Error', errorMessage, 'danger');
        }
    }
}

export const saveUser = (newUser, redirect = null) => async dispatch => {
    try {
        const response = await axios.put('api/users', newUser);
        dispatch({ type: CONSTANTS.SAVE_USER_SUCCESSFULL, data: response.data });

        if (redirect) {
            redirect();
        }

        renderNotification('Operation completed', 'User has been updated', 'success');
    }
    catch(error) {
        dispatch({ type: CONSTANTS.SAVE_USER_FAILED });

        if (error.response.status === 400 && error.response.data.title === 'One or more validation errors occurred.') {
            for (const e in error.response.data.errors) {
                renderNotification('Error', error.response.data.errors[e][0], 'danger');
            }
        } else {
            let errorMessage = error.response.status === 400 ?
                error.response.data :
                "An error occured while updating user. Try later.";

            renderNotification('Error', errorMessage, 'danger');
        }
    }
}

export const cancelUserSave = (redirect = null) => async dispatch => {
    dispatch({ type: CONSTANTS.CANCEL_USER_SAVE });

    if (redirect) {
        redirect();
    }
}

export const deleteUser = (userId, redirect = null) => async dispatch => {
    try {
        const response = await axios.delete('api/users/' + userId);
        dispatch({ type: CONSTANTS.DELETE_USER_SUCCESSFULL, data: response.data });

        if (redirect) {
            redirect();
        }

        renderNotification('Operation completed', 'User has been deleted', 'success');
    }
    catch (error) {
        dispatch({ type: CONSTANTS.DELETE_USER_FAILED });

        let errorMessage = error.response.data;
        renderNotification('Error', errorMessage, 'danger');
    }
}