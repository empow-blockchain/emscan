import React, { Fragment } from 'react';
import Home from './controllers/Home';
import Producer from './controllers/Producer'
import Block from './controllers/Block'
import BlockDetail from './controllers/BlockDetail'
import TransactionDetail from './controllers/TransactionDetail';
import Address from './controllers/Address';
import WalletTransfer from './controllers/WalletTransfer';
import WalletStake from './controllers/WalletStake';
import Header from './components/Header'
import Footer from './components/Footer'
import { BrowserRouter as Router, Route } from "react-router-dom";

import 'bootstrap/scss/bootstrap.scss'
import './assets/scss/style.scss';

const routes = [
    {
        path: '/',
        exact: true,
        main: () => <Home />
    },
    {
        path: '/producer',
        exact: false,
        main: () => <Producer />
    },
    {
        path: '/block/:number',
        exact: false,
        main: ({ location, match }) => <BlockDetail location={location} match={match} />
    },
    {
        path: '/blocks',
        exact: false,
        main: () => <Block />
    },
    {
        path: '/tx/:hash',
        exact: false,
        main: ({ location, match }) => <TransactionDetail location={location} match={match} />
    },
    {
        path: '/address/:address',
        exact: false,
        main: ({ location, match }) => <Address location={location} match={match} />
    },
    {
        path: '/wallet/transfer',
        exact: false,
        main: ({ location, match }) => <WalletTransfer location={location} match={match} />
    },
    {
        path: '/wallet/stake',
        exact: false,
        main: ({ location, match }) => <WalletStake location={location} match={match} />
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
