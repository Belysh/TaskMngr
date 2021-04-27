import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

const rootElement = document.getElementById('root');

ReactDOM.render(
    <>
        <ReactNotification />
        <App />
    </>,
    rootElement);

registerServiceWorker();