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

class WalletRam extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isBuyLoading: false,
            isSellLoading: false,
            ramInfo: null,
            buyAmount: 0,
            sellAmount: 0
        };
    };

    componentDidMount() {
        BlockchainAPI.getRamInfo().then(ramInfo => {
            this.setState({ ramInfo })
        })
    }

    componentDidUpdate(prevProps) {
        if (_.isEqual(prevProps, this.props)) {
            return;
        }
    }

    buyRam() {
        this.setState({ isBuyLoading: true })

        const { buyAmount } = this.state

        const tx = window.empow.callABI("ram.empow", "buy", [this.props.addressInfo.address, this.props.addressInfo.address, parseInt(buyAmount)])
        tx.addApprove("*", "unlimited")
        const handler = window.empow.signAndSend(tx)

        handler.on("failed", (error) => {
            toastr.error('', Utils.getTransactionErrorMessage(error + ""))
            this.setState({ isBuyLoading: false })
        })

        handler.on("success", (res) => {
            toastr.success('', "Buy Ram Success", {
                component: (
                    <a target="_blank" rel="noopener noreferrer" href={`/tx/${res.transaction.hash}`}>View Tx</a>
                )
            })
            this.setState({ isBuyLoading: false })

            // reload address info
            ServerAPI.getAddress(this.props.addressInfo.address).then(addressInfo => this.props.setAddressInfo(addressInfo))
        })
    }

    sellRam() {
        this.setState({ isSellLoading: true })

        const { sellAmount } = this.state

        const tx = window.empow.callABI("ram.empow", "sell", [this.props.addressInfo.address, this.props.addressInfo.address, parseInt(sellAmount)])
        tx.addApprove("*", "unlimited")
        const handler = window.empow.signAndSend(tx)

        handler.on("failed", (error) => {
            toastr.error('', Utils.getTransactionErrorMessage(error + ""))
            this.setState({ isSellLoading: false })
        })

        handler.on("success", (res) => {
            toastr.success('', "Sell Ram Success", {
                component: (
                    <a target="_blank" rel="noopener noreferrer" href={`/tx/${res.transaction.hash}`}>View Tx</a>
                )
            })
            this.setState({ isSellLoading: false })

            // reload address info
            ServerAPI.getAddress(this.props.addressInfo.address).then(addressInfo => this.props.setAddressInfo(addressInfo))
        })
    }

    render() {

        const { ramInfo, buyAmount, sellAmount, isBuyLoading, isSellLoading } = this.state
        const { addressInfo } = this.props

        let maxBuy = 0
        let maxSell = 0

        if (ramInfo && addressInfo) {
            maxBuy = addressInfo.balance / ramInfo.buy_price
            maxSell = addressInfo.ram_info.available
        }


        return (
            <section id="wallet-ram">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3">
                            <WalletSidebar active="ram"></WalletSidebar>
                        </div>
                        <div className="col-md-9">
                            <div className="card">
                                {!addressInfo && <InstallWalletOverlay />}
                                {addressInfo && ramInfo &&
                                    <Fragment>
                                        <div className="statistic">
                                            <div className="one-statistic">
                                                <p className="title">TOTAL RAM</p>
                                                <p className="number">{Utils.formatCurrency(addressInfo.ram_info.total)} Bytes</p>
                                            </div>
                                            <div className="one-statistic">
                                                <p className="title">CURRENT RAM</p>
                                                <p className="number">{Utils.formatCurrency(addressInfo.ram_info.available, 8)} Bytes</p>
                                            </div>
                                            <div className="one-statistic">
                                                <p className="title">BUY PRICE</p>
                                                <p className="number">{Utils.formatCurrency(ramInfo.buy_price, 8)} EM/Bytes</p>
                                            </div>
                                            <div className="one-statistic">
                                                <p className="title">SELL PRICE</p>
                                                <p className="number">{Utils.formatCurrency(ramInfo.sell_price, 8)} EM/Bytes</p>
                                            </div>
                                        </div>
                                        <div className="waper-row">
                                            <div className="buy">
                                                <p className="label">BUY RAM</p>
                                                <Slider
                                                    min={0}
                                                    max={maxBuy}
                                                    step={1}
                                                    value={buyAmount}
                                                    onChange={(value) => this.setState({ buyAmount: value })}
                                                />
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <Input className="buy-amount-bytes" type="text" value={buyAmount} onChange={(e) => this.setState({ buyAmount: e.target.value })} suffix="Bytes"></Input>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <Input className="buy-amount-em" disabled={true} type="text" value={parseFloat(addressInfo.balance - (buyAmount * ramInfo.buy_price)).toFixed(8)} suffix="EM"></Input>
                                                    </div>
                                                </div>
                                                <button className={`btn btn-color ${isBuyLoading ? "btn-color-loading" : ""}`} onClick={() => this.buyRam()}>Buy Ram</button>
                                            </div>
                                            <div className="line">
                                                <span></span>
                                            </div>
                                            <div className="sell">
                                                <p className="label">SELL RAM</p>
                                                <Slider
                                                    min={0}
                                                    max={maxSell}
                                                    step={1}
                                                    value={sellAmount}
                                                    onChange={(value) => this.setState({ sellAmount: value })}
                                                />
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <Input className="buy-amount-bytes" type="text" value={sellAmount} onChange={(e) => this.setState({ buyAmount: e.target.value })} suffix="Bytes"></Input>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <Input className="buy-amount-em" disabled={true} type="text" value={parseFloat(addressInfo.balance + (sellAmount * ramInfo.sell_price)).toFixed(8)} suffix="EM"></Input>
                                                    </div>
                                                </div>
                                                <button className={`btn btn-color ${isSellLoading ? "btn-color-loading" : ""}`} onClick={() => this.sellRam()}>Sell Ram</button>
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
}))(WalletRam)