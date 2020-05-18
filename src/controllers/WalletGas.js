import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import WalletSidebar from '../components/WalletSidebar'
import Input from '../components/Input'
import { toastr } from 'react-redux-toastr'
import Utils from '../utils/index'
import InstallWalletOverlay from '../components/InstallWalletOverlay';
import ServerAPI from '../ServerAPI';
import _ from 'lodash'
import { setAddressInfo } from '../reducers/appReducer'
import BlockchainAPI from '../BlockchainAPI';
import Slider from 'react-rangeslider'

class WalletGas extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isBuyLoading: false,
            isSellLoading: false,
            ramInfo: null,
            buyAmount: 0,
            sellAmount: 0,
            gasRatio: 1
        };
    };

    componentDidMount() {
        setTimeout(() => {
            this.reloadAccountInfo()
        }, 1000)
    }

    componentDidUpdate(prevProps) {
        if (_.isEqual(prevProps, this.props)) {
            return;
        }
    }

    reloadAccountInfo() {
        if (this.props.addressInfo) {

            let newObj = Object.assign({}, this.props.addressInfo)

            BlockchainAPI.getAddress(this.props.addressInfo.address).then(info => {
                newObj.balance = info.balance
                newObj.gas_info = info.gas_info
                this.props.setAddressInfo(newObj)
            })
        }
    }

    pledgeGas() {
        this.setState({ isBuyLoading: true })

        const { buyAmount, gasRatio } = this.state

        const tx = window.empow.callABI("gas.empow", "pledge", [this.props.addressInfo.address, this.props.addressInfo.address, parseFloat(buyAmount / gasRatio).toFixed(2).toString()])
        tx.addApprove("*", "unlimited")
        const handler = window.empow.signAndSend(tx)

        handler.on("failed", (error) => {
            toastr.error('', Utils.getTransactionErrorMessage(error + ""))
            this.setState({ isBuyLoading: false })
        })

        handler.on("success", (res) => {
            toastr.success('', "Pledge Gas Success", {
                component: (
                    <a target="_blank" rel="noopener noreferrer" href={`/tx/${res.transaction.hash}`}>View Tx</a>
                )
            })
            this.setState({ isBuyLoading: false })

            // reload address info
            ServerAPI.getAddress(this.props.addressInfo.address).then(addressInfo => this.props.setAddressInfo(addressInfo))
        })
    }

    unpledgeGas() {
        this.setState({ isSellLoading: true })

        const { sellAmount, gasRatio } = this.state

        const tx = window.empow.callABI("gas.empow", "unpledge", [this.props.addressInfo.address, this.props.addressInfo.address, parseFloat(sellAmount / gasRatio).toFixed(2).toString()])
        tx.addApprove("*", "unlimited")
        const handler = window.empow.signAndSend(tx)

        handler.on("failed", (error) => {
            toastr.error('', Utils.getTransactionErrorMessage(error + ""))
            this.setState({ isSellLoading: false })
        })

        handler.on("success", (res) => {
            toastr.success('', "Unpledge Gas Success", {
                component: (
                    <a target="_blank" rel="noopener noreferrer" href={`/tx/${res.transaction.hash}`}>View Tx</a>
                )
            })
            this.setState({ isSellLoading: false })

            // reload address info
            ServerAPI.getAddress(this.props.addressInfo.address).then(addressInfo => this.props.setAddressInfo(addressInfo))
        })
    }

    getSelfPledged() {
        const { addressInfo, } = this.props
        if (!addressInfo || addressInfo.gas_info.pledged_info.length === 0) return 0;

        let amount = 0

        for (let i = 0; i < addressInfo.gas_info.pledged_info.length; i++) {
            if (addressInfo.gas_info.pledged_info[i].pledger === addressInfo.address)
                amount += parseFloat(addressInfo.gas_info.pledged_info[i].amount)
        }

        return amount
    }

    getPledgedOthers() {
        const { addressInfo } = this.state
        if (!addressInfo || addressInfo.gas_info.pledged_info.length === 0) return 0;

        let amount = 0

        for (let i = 0; i < addressInfo.gas_info.pledged_info.length; i++) {
            if (addressInfo.gas_info.pledged_info[i].pledger !== addressInfo.address)
                amount += parseFloat(addressInfo.gas_info.pledged_info[i].amount)
        }

        return amount
    }

    render() {

        const { buyAmount, sellAmount, isBuyLoading, isSellLoading, gasRatio } = this.state
        const { addressInfo } = this.props

        return (
            <section id="wallet-ram">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3">
                            <WalletSidebar active="gas"></WalletSidebar>
                        </div>
                        <div className="col-md-9">
                            <div className="card">
                                {!addressInfo && <InstallWalletOverlay />}
                                {addressInfo &&
                                    <Fragment>
                                        <div className="statistic">
                                            <div className="one-statistic">
                                                <p className="title">TOTAL GAS</p>
                                                <p className="number">{Utils.formatCurrency(addressInfo.gas_info.limit)}</p>
                                            </div>
                                            <div className="one-statistic">
                                                <p className="title">CURRENT GAS</p>
                                                <p className="number">{Utils.formatCurrency(addressInfo.gas_info.current_total, 0)}</p>
                                            </div>
                                            <div className="one-statistic">
                                                <p className="title">INCREASE SPEED</p>
                                                <p className="number">{Utils.formatCurrency(addressInfo.gas_info.increase_speed)} GAS/s</p>
                                            </div>
                                            <div className="one-statistic">
                                                <p className="title">SELF PLEDGED</p>
                                                <p className="number">{Utils.formatCurrency(this.getSelfPledged())} EM</p>
                                            </div>
                                            <div className="one-statistic">
                                                <p className="title">PLEDGED BY OTHERS</p>
                                                <p className="number">{Utils.formatCurrency(this.getPledgedOthers())} EM</p>
                                            </div>
                                        </div>
                                        <div className="waper-row">
                                            <div className="buy">
                                                <p className="label">PLEDGE GAS</p>
                                                <Slider
                                                    min={0}
                                                    max={addressInfo.balance * gasRatio}
                                                    step={1}
                                                    value={buyAmount}
                                                    onChange={(value) => this.setState({ buyAmount: value })}
                                                />
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <Input className="buy-amount-bytes" type="text" value={buyAmount} onChange={(e) => this.setState({ buyAmount: e.target.value })} suffix="EM"></Input>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <Input className="buy-amount-em" disabled={true} type="text" value={parseFloat(addressInfo.balance - buyAmount / gasRatio).toFixed(8)} suffix="EM"></Input>
                                                    </div>
                                                </div>
                                                <button className={`btn btn-color ${isBuyLoading ? "btn-color-loading" : ""}`} onClick={() => this.pledgeGas()}>Pledge Gas</button>
                                            </div>
                                            <div className="line">
                                                <span></span>
                                            </div>
                                            <div className="sell">
                                                <p className="label">UNPLEDGE GAS</p>
                                                <Slider
                                                    min={0}
                                                    max={this.getSelfPledged() * gasRatio}
                                                    step={1}
                                                    value={sellAmount}
                                                    onChange={(value) => this.setState({ sellAmount: value })}
                                                />
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <Input className="buy-amount-bytes" type="text" value={sellAmount} onChange={(e) => this.setState({ buyAmount: e.target.value })} suffix="EM"></Input>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <Input className="buy-amount-em" disabled={true} type="text" value={parseFloat(addressInfo.balance + sellAmount / gasRatio).toFixed(8)} suffix="EM"></Input>
                                                    </div>
                                                </div>
                                                <button className={`btn btn-color ${isSellLoading ? "btn-color-loading" : ""}`} onClick={() => this.unpledgeGas()}>Unpledge Gas</button>
                                            </div>
                                        </div>
                                    </Fragment>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default connect(state => ({
    addressInfo: state.app.addressInfo
}), ({
    setAddressInfo: setAddressInfo
}))(WalletGas)