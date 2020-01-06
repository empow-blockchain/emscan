import React, { Component } from 'react'
import { connect } from 'react-redux';
import WalletSidebar from '../components/WalletSidebar'
import Input from '../components/Input'
import Select from 'react-select';
import {toastr} from 'react-redux-toastr'
import Utils from '../utils/index'
import InstallWalletOverlay from '../components/InstallWalletOverlay';

class WalletTransfer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            to: "",
            amount: 0,
            tokenSelectValue: { value: 'em', label: 'EM (EMPOW)' },
            tokenSelectOptions: [{ value: 'em', label: 'EM (EMPOW)' }],
            memo: "",
            isLoading: false
        };
    };

    async componentDidMount() {
    }

    async transfer() {
        this.setState({ isLoading: true })

        const {tokenSelectValue, to, amount, memo} = this.state

        const tx = window.empow.callABI("token.empow", "transfer", [tokenSelectValue.value, this.props.addressInfo.address, to, amount, memo])
        tx.addApprove("*", "unlimited")
        const handler = window.empow.signAndSend(tx)

        handler.on("failed", (error) => {
            toastr.error('', Utils.getTransactionErrorMessage(error + ""))
            this.setState({ isLoading: false })
        })
        
        handler.on("success", (res) => {
            toastr.success('', "Transfer Success", {
                component: (
                    <a target="_blank" href={`/tx/${res.transaction.hash}`}>View Tx</a>
                )
            })
            this.setState({ isLoading: false })
        })
    }

    pickAmount(percent) {
        this.setState({
            amount: this.props.addressInfo.balance * (percent / 100)
        })
    }

    render() {

        const { to, amount, memo, isLoading } = this.state
        const { addressInfo } = this.props

        return (
            <section id="wallet-transfer">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3">
                            <WalletSidebar active="transfer"></WalletSidebar>
                        </div>
                        <div className="col-md-9">
                            <div className="card">
                                {!addressInfo && <InstallWalletOverlay></InstallWalletOverlay>}
                                <div className="row">
                                    <div className="col-md-6">
                                        <Input className="to" title="Transfer To" type="text" value={to} onChange={(e) => this.setState({ to: e.target.value })}></Input>
                                        <Input className="amount" title="Amount" type="text" value={amount} onChange={(e) => this.setState({ amount: e.target.value })} suffix="EM"></Input>
                                        <ul className="pick-amount list-inline">
                                            <li onClick={() => this.pickAmount(25)}>25%</li>
                                            <li onClick={() => this.pickAmount(50)}>50%</li>
                                            <li onClick={() => this.pickAmount(75)}>75%</li>
                                            <li onClick={() => this.pickAmount(100)}>100%</li>
                                        </ul>
                                        <p className="balance time">Balance: {addressInfo ? addressInfo.balance : 0} EM</p>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="token">
                                            <span className="label">SELECT TOKEN</span>
                                            <Select className="select-token" classNamePrefix="select-token" value={this.state.tokenSelectValue} options={this.state.tokenSelectOptions} onChange={(tokenSelectValue) => this.setState({ tokenSelectValue })}></Select>
                                        </div>
                                        <Input className="memo" title="Memo" optional={true} type="text" value={memo} placeholder="Send a message to the recipient..." onChange={(e) => this.setState({ memo: e.target.value })}></Input>
                                    </div>
                                    <button className={`btn btn-color ${isLoading ? "btn-color-loading" : ""}`} onClick={() => this.transfer()}>Transfer</button>
                                </div>
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
}))(WalletTransfer)