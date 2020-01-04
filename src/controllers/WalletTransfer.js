import React, { Component } from 'react'
import { connect } from 'react-redux';
import WalletSidebar from '../components/WalletSidebar'

import LoadingIcon from '../assets/images/loading.gif'
import upArrowIcon from '../assets/images/up-arrow.png'

import FlagIcon from '../components/FlagIcon'
import ActionTag from '../components/ActionTag'
import ActionContent from '../components/ActionContent'
import Proccess from '../components/Proccess'

import ServerAPI from '../ServerAPI'
import Utils from '../utils/index'
import moment from 'moment'
import LoadingOverlay from 'react-loading-overlay';
import BlockchainAPI from '../BlockchainAPI';
import FlagIconFactory from 'react-flag-icon-css';

class WalletTransfer extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };
    };

    async componentDidMount() {
    }

    render() {
        return (
            <div className="wallet-tranfer">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3">
                            <WalletSidebar active="transfer"></WalletSidebar>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(state => ({
    addressInfo: state.app.addressInfo
}), ({
}))(WalletTransfer)