import React from 'react';
import HomeController from './controllers/HomeController';
import { BrowserRouter as Router, Route } from "react-router-dom";
import 'bootstrap/scss/bootstrap.scss'
import './assets/scss/style.scss';

const routes = [
    {
        path: '/',
        exact: true,
        main: () => <HomeController />
    }
];

class App extends React.Component {
    render() {
        return <Router>
            {routes.map((route, index) => {
                return <Route key={index}
                    path={route.path}
                    exact={route.exact}
                    component={route.main} />
            })}
        </Router>
    }
}


export default App
