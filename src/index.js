import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { configureStore, getDefaultMiddleware } from 'redux-starter-kit';
import reducer from './reducers/index'
import { Provider } from 'react-redux';
import ReduxToastr from 'react-redux-toastr'

var store = configureStore({
    middleware: [
        ...getDefaultMiddleware()
    ],
    reducer
});

ReactDOM.render(
    <Provider store={store}>
        <ReduxToastr
            timeOut={10000}
            newestOnTop={false}
            preventDuplicates
            position="top-center"
            getState={(state) => state.toastr} // This is the default
            transitionIn="bounceIn"
            transitionOut="bounceOut"
            progressBar={false}
            closeOnToastrClick={false} />
        <App />
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
