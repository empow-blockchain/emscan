import React, { Component } from 'react'
import { connect } from 'react-redux';
import WalletSidebar from '../components/WalletSidebar'
import Input from '../components/Input'
import { toastr } from 'react-redux-toastr'
import Utils from '../utils/index'
import InstallWalletOverlay from '../components/InstallWalletOverlay';
import ServerAPI from '../ServerAPI';
import moment from 'moment'
import _ from 'lodash'
import Switch from "react-switch";

class WalletStake extends Component {

    constructor(props) {
        super(props);

        this.state = {
            amount: 0,
            isLoading: false,
            listStake: [],
            totalPackage: 0,
            packageUnstaked: 0,
            totalStaking: 0,
            hasWithdraw: 0,
            canWithdraw: 0,
            percentPerDay: 0.000833333333,
            blockPerDay: 172800,
            lastBlockNumber: 0,
            hideUnstaked: false
        };
    };

    componentDidMount() {
        ServerAPI.getBlocks(1, 1).then(block => {
            this.setState({ lastBlockNumber: block[0].number })

            this.getStakeInfo()
            this.calcWithdrawCountdown()
        })
    }


    async componentDidUpdate(prevProps) {
        if (_.isEqual(prevProps, this.props)) {
            return;
        }

        this.getStakeInfo()
    }

    getStakeInfo(loop = false) {

        if (!this.props.addressInfo) return;

        ServerAPI.getStake(this.props.addressInfo.address).then(listStake => {

            if (_.isEqual(listStake, this.state.listStake)) {
                if (!loop) return
                else {
                    setTimeout(() => {
                        this.getStakeInfo()
                    }, 1000)
                }
            }

            let totalPackage = listStake.length
            let packageUnstaked = 0
            let hasWithdraw = 0
            let canWithdraw = 0
            let totalStaking = 0

            for (let i = 0; i < listStake.length; i++) {
                listStake[i].hasWithdraw = this.calcHasWithdraw(listStake[i].amount, listStake[i].startBlock, listStake[i].lastBlockWithdraw)
                hasWithdraw += listStake[i].hasWithdraw

                if (listStake[i].unstake === true) {
                    packageUnstaked++
                    listStake[i].canWithdraw = 0
                } else {
                    listStake[i].canWithdraw = this.calcCanWithdraw(listStake[i].amount, listStake[i].lastBlockWithdraw)
                    canWithdraw += listStake[i].canWithdraw
                    totalStaking += parseFloat(listStake[i].amount)
                }
            }

            this.setState({
                listStake,
                totalPackage,
                packageUnstaked,
                hasWithdraw,
                canWithdraw,
                totalStaking
            })
        })
    }

    calcWithdrawCountdown() {
        const { listStake } = this.state
        let now = new Date().getTime();

        if (listStake.length > 0) {
            for (let i = 0; i < listStake.length; i++) {
                if (listStake[i].canWithdraw === 0 && listStake[i].unstake === false) {
                    const canWithdrawTime = (listStake[i].lastWithdrawTime / 10 ** 6) + (24 * 60 * 60 * 1000)
                    const distance = canWithdrawTime - now;
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    listStake[i].withdrawCountDown = `${hours}h ${minutes}m ${seconds}s`
                }
            }

            this.setState({ listStake })
        }

        setTimeout(() => {
            this.calcWithdrawCountdown()
        }, 1000)
    }

    calcHasWithdraw(amount, startBlock, lastBlockWithdraw) {
        const { percentPerDay, blockPerDay } = this.state

        const totalDayWithdraw = Math.floor((lastBlockWithdraw - startBlock) / blockPerDay)
        const interestAmountPerDay = amount * percentPerDay

        return totalDayWithdraw * interestAmountPerDay > 0 ? totalDayWithdraw * interestAmountPerDay : 0
    }

    calcCanWithdraw(amount, lastBlockWithdraw) {
        const { percentPerDay, blockPerDay, lastBlockNumber } = this.state

        const totalDayCanWithdraw = Math.floor((lastBlockNumber - lastBlockWithdraw) / blockPerDay)
        const interestAmountPerDay = amount * percentPerDay

        return totalDayCanWithdraw * interestAmountPerDay > 0 ? totalDayCanWithdraw * interestAmountPerDay : 0
    }

    pickAmount(percent) {
        this.setState({
            amount: this.props.addressInfo.balance * (percent / 100)
        })
    }

    stake() {
        this.setState({ isLoading: true })

        const { amount } = this.state

        const tx = window.empow.callABI("stake.empow", "stake", [this.props.addressInfo.address, amount.toString()])
        tx.addApprove("*", "unlimited")
        const handler = window.empow.signAndSend(tx)

        handler.on("failed", (error) => {
            toastr.error('', Utils.getTransactionErrorMessage(error + ""))
            this.setState({ isLoading: false })
        })

        handler.on("success", (res) => {
            toastr.success('', "Stake Success", {
                component: (
                    <a target="_blank" rel="noopener noreferrer" href={`/tx/${res.transaction.hash}`}>View Tx</a>
                )
            })
            this.setState({ isLoading: false })
            this.getStakeInfo(true)
        })
    }

    withdraw(value) {
        if (value.canWithdraw === 0 || value.unstake === true) return

        const tx = window.empow.callABI("stake.empow", "withdraw", [this.props.addressInfo.address, value.packageId])
        tx.addApprove("*", "unlimited")
        const handler = window.empow.signAndSend(tx)

        handler.on("failed", (error) => {
            toastr.error('', Utils.getTransactionErrorMessage(error + ""))
        })

        handler.on("success", (res) => {
            toastr.success('', "Withdraw Success", {
                component: (
                    <a target="_blank" rel="noopener noreferrer" href={`/tx/${res.transaction.hash}`}>View Tx</a>
                )
            })
            this.getStakeInfo(true)
        })
    }

    unstake(value) {
        if (value.unstake === true) return

        const tx = window.empow.callABI("stake.empow", "unstake", [this.props.addressInfo.address, value.packageId])
        tx.addApprove("*", "unlimited")
        const handler = window.empow.signAndSend(tx)

        handler.on("failed", (error) => {
            toastr.error('', Utils.getTransactionErrorMessage(error + ""))
        })

        handler.on("success", (res) => {
            toastr.success('', "Unstake Success", {
                component: (
                    <a target="_blank" rel="noopener noreferrer" href={`/tx/${res.transaction.hash}`}>View Tx</a>
                )
            })
            this.getStakeInfo(true)
        })
    }

    render() {

        const { amount, isLoading, listStake, hasWithdraw, canWithdraw, totalPackage, packageUnstaked, totalStaking, hideUnstaked } = this.state
        const { addressInfo } = this.props

        return (
            <section id="wallet-stake">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3">
                            <WalletSidebar active="stake"></WalletSidebar>
                        </div>
                        <div className="col-md-9">
                            <div className="card">
                                {!addressInfo && <InstallWalletOverlay />}
                                <div className="statistic">
                                    <div className="one-statistic">
                                        <p className="title">TOTAL PACKAGES</p>
                                        <p className="number">{Utils.formatCurrency(totalPackage, 0)}</p>
                                    </div>
                                    <div className="one-statistic">
                                        <p className="title">PACKAGE UNSTAKED</p>
                                        <p className="number">{Utils.formatCurrency(packageUnstaked, 0)}</p>
                                    </div>
                                    <div className="one-statistic">
                                        <p className="title">TOTAL STAKING</p>
                                        <p className="number">{Utils.formatCurrency(totalStaking, 8)} EM</p>
                                    </div>
                                    <div className="one-statistic">
                                        <p className="title">HAS WITHDRAWN</p>
                                        <p className="number">{Utils.formatCurrency(hasWithdraw, 8)} EM</p>
                                    </div>
                                    <div className="one-statistic">
                                        <p className="title">CAN WITHDRAWN</p>
                                        <p className="number">{Utils.formatCurrency(canWithdraw, 8)} EM</p>
                                    </div>
                                </div>
                                <div className="stake">
                                    <Input className="amount" title="STAKE AMOUNT" type="text" value={amount} onChange={(e) => this.setState({ amount: e.target.value })} suffix="EM"></Input>
                                    <ul className="pick-amount list-inline">
                                        <li onClick={() => this.pickAmount(25)}>25%</li>
                                        <li onClick={() => this.pickAmount(50)}>50%</li>
                                        <li onClick={() => this.pickAmount(75)}>75%</li>
                                        <li onClick={() => this.pickAmount(100)}>100%</li>
                                    </ul>
                                    <p className="balance time">Balance: {addressInfo ? addressInfo.balance : 0} EM</p>
                                    <div style={{ clear: "both" }}></div>
                                    <button className={`btn btn-color ${isLoading ? "btn-color-loading" : ""}`} onClick={() => this.stake()}>Stake</button>
                                </div>
                            </div>
                            {listStake.length > 0 &&
                                <div className="table table-packages">
                                    <div className="table-header">
                                        <p className="title">PACKAGES</p>
                                        <div className="show-unstaked" onClick={() => this.setState({ hideUnstaked: !hideUnstaked })}>
                                            <Switch height={14} width={30} onColor="#413d5d" uncheckedIcon={false} checkedIcon={false} checked={hideUnstaked} />
                                            <span>Hide Unstaked</span>
                                        </div>
                                    </div>
                                    <div className="table-title">
                                        <ul className="list-inline">
                                            <li>ID</li>
                                            <li>Amount</li>
                                            <li>Status</li>
                                            <li>Last Withdraw</li>
                                            <li>Has Withdraw</li>
                                            <li>Can Withdraw</li>
                                            <li></li>
                                        </ul>
                                    </div>
                                    <ul className="list-inline table-body">
                                        {
                                            listStake.map((value, index) => {

                                                if (hideUnstaked && value.unstake) return null

                                                return (
                                                    <li key={index} className="table-row one-package">
                                                        <ul className="list-inline">
                                                            <li>{value.packageId}</li>
                                                            <li><b>{value.amount} EM</b></li>
                                                            <li>
                                                                <div className="status">
                                                                    {value.unstake === true && <div className="status-error">Unstaked</div>}
                                                                    {value.unstake === false && <div className="status-success">Running</div>}
                                                                </div>
                                                            </li>
                                                            <li className="time" style={{ fontSize: 16 }}>{moment(value.lastWithdrawTime / 10 ** 6).fromNow()}</li>
                                                            <li>{Utils.formatCurrency(value.hasWithdraw, 8)} EM</li>
                                                            <li>{Utils.formatCurrency(value.canWithdraw, 8)} EM</li>
                                                            <li>
                                                                {!value.unstake &&
                                                                    <div className="btn-withdraw">
                                                                        <button onClick={() => this.withdraw(value)} className={`btn btn-default ${value.canWithdraw === 0 ? "btn-disable" : ""}`} style={{ marginRight: 10, width: 95 }}>{value.canWithdraw > 0 ? "Withdraw" : value.withdrawCountDown}</button>
                                                                        <button onClick={() => this.unstake(value)} className="btn btn-default">Unstake</button>
                                                                    </div>
                                                                }
                                                            </li>
                                                        </ul>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            }
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
}))(WalletStake)