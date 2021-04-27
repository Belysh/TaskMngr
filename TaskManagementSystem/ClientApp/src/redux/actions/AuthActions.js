import axios from 'axios';
import { renderNotification } from '../../utils/NotificationHelper';
import CONSTANTS from '../constants';
import history from '../../utils/History';

export const refreshToken = async dispatch => {
    try {
        const response = await axios.post('api/token/refresh', {
            accessToken: localStorage.getItem('accessToken'),
            refreshToken: localStorage.getItem('refreshToken')
        });

        dispatch({
            type: CONSTANTS.REFRESH_TOKEN_SUCCESSFULL, accessToken: response.data.accessToken, refreshToken: response.data.refreshToken
        });
    }
    catch {
        dispatch(log_out());
    }
}

export const login = (loginData, redirect = null) => async dispatch => {
    try {
        const response = await axios.post('api/auth/login', loginData);
        dispatch({ type: CONSTANTS.LOGIN_SUCCESSFULL, accessToken: response.data.accessToken, refreshToken: response.data.refreshToken });

        if (redirect) {
            redirect();
        }
    } catch (error) {
        dispatch({ type: CONSTANTS.LOGIN_FAILED });

        if (error.response.status === 401) {
            let errorMessage = 'Incorrect login or password';
            renderNotification('Error', errorMessage, 'danger');
        } else if (error.response.status === 400) {
            console.dir(error);

            if (error.response.data.title === 'One or more validation errors occurred.') {
                for (const e in error.response.data.errors) {
                    renderNotification('Error', error.response.data.errors[e][0], 'danger');
                }
            } else {
                let errorMessage = error.response.status === 400 ?
                    error.response.data :
                    "An error occured while updating user. Try later.";

                renderNotification('Error', errorMessage, 'danger');
            }
        } else {
            let errorMessage = 'Something went wrong. Try later.';
            renderNotification('Error', errorMessage, 'danger');
        }
    }
}

export const log_out = (redirect = null) => async dispatch => {
    dispatch({ type: CONSTANTS.LOGOUT });
    history.push('/auth/login');
}