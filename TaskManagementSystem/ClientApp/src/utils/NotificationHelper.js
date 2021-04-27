import { store } from 'react-notifications-component';

export const renderNotification = (title, message, type = 'default') => {
    store.addNotification({
        title: title,
        message: message,
        type: type,
        insert: "bottom",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
            duration: 4000
        }
    });
}