import React, { Fragment } from 'react';
import HomeController from './controllers/HomeController';
import TransactionDetail from './controllers/TransactionDetail';
import Header from './components/Header'
import Footer from './components/Footer'
import { BrowserRouter as Router, Route } from "react-router-dom";
import 'bootstrap/scss/bootstrap.scss'
import './assets/scss/style.scss';

const routes = [
    {
        path: '/',
        exact: true,
        main: () => <HomeController />
    },
    {
        path: '/tx/:hash',
        exact: false,
        main: ({ location, match }) => <TransactionDetail location={location} match={match} />
    }
];

class App extends React.Component {
    render() {
        return (
            <Fragment>
                <Header />
                <Router>
                    {routes.map((route, index) => {
                        return <Route key={index}
                            path={route.path}
                            exact={route.exact}
                            component={route.main} />
                    })}
                </Router>
                <Footer />
            </Fragment>
        )
    }
}


export default App
