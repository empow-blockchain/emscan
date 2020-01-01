import React, { Component } from 'react'
import { connect } from 'react-redux';
import Select from 'react-select';
import io from 'socket.io-client'
import { SOCKET_ENDPOINT } from '../constants/index'
import {
    setNewBlock,
    setAddressInfo
} from '../reducers/appReducer'

import DownloadIcon from '../assets/images/download-icon.png'
import SearchIcon from '../assets/images/search-icon.png'
import NotiIcon from '../assets/images/noti-icon.png'
import Logo from '../assets/images/logo-header.png'
import PattenLeft from '../assets/images/pattent-left.png'
import PattenRight from '../assets/images/pattent-right.png'
import PattenLogoLeft from '../assets/images/patten-logo-left.png'
import PattenLogoRight from '../assets/images/patten-logo-right.png'
import DropdownArrowIcon from '../assets/images/drop-down-arrow.png'
import ServerAPI from '../ServerAPI';
import Utils from '../utils';

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            networkSelectValue: { value: 'testnet', label: 'EMPOW TESTNET' },
            networkSelectOptions: [
                { value: 'mainnet', label: 'EMPOW MAINNET' },
                { value: 'testnet', label: 'EMPOW TESTNET' }
            ],
            blockNumber: 0,
            countTransaction: 0,
            txCount: 0,
            EMTokenInfo: null,
            addressInfo: null
        }
    };

    async componentDidMount() {
        let socket = io(SOCKET_ENDPOINT)

        socket.on("connect", (res) => {
            console.log("Connected to socket");
            socket.emit("get_new_block", null)
        })

        socket.on("res_new_block", (data) => {
            this.props.setNewBlock(data)
            this.setState({
                blockNumber: data.number,
                countTransaction: parseInt(this.state.countTransaction) + parseInt(data.tx_count),
                txCount: data.tx_count
            })
        })

        ServerAPI.getCountTransaction().then(countTransaction => {
            this.setState({ countTransaction })
        })

        ServerAPI.getTokenInfo("em").then(EMTokenInfo => {
            console.log(EMTokenInfo);
            this.setState({ EMTokenInfo })
        })

        if (window.empow) {
            const address = await window.empow.enable()

            if (address) {
                const addressInfo = await ServerAPI.getAddress(address)
                this.props.setAddressInfo(addressInfo)
                this.setState({
                    addressInfo
                })
            }
        }
    }

    render() {

        const { blockNumber, countTransaction, txCount, EMTokenInfo, addressInfo } = this.state

        return (
            <header>
                <div className="container">
                    <ul className="top-header">
                        <li>BLOCK NUMBER: {Utils.formatCurrency(blockNumber)}</li>
                        <li>TRANSACTION: {Utils.formatCurrency(countTransaction)}</li>
                        <li>TPS: {txCount}/374</li>
                        <li>CIRCULATING SUPPLY: {EMTokenInfo ? Utils.formatCurrency(EMTokenInfo.supply, 0) : 0} EM</li>
                    </ul>
                </div>
                <div className="navbar">
                    <img className="patten-left" src={PattenLeft} alt="patten left"></img>
                    <img className="patten-right" src={PattenRight} alt="patten right"></img>
                    <div className="container">
                        <ul className="list-inline">
                            <li className="main-menu"><a href="/">Home</a></li>
                            <li className="main-menu"><a href="/block">Block</a></li>
                            <li className="main-menu"><a href="/producer">Producer</a></li>
                            <li className="main-menu"><a href="/stake">Stake</a></li>
                            <li className="main-menu"><a href="/token">Token</a></li>
                            {!addressInfo && <li className="main-menu"><a href="https://chrome.google.com/webstore/detail/empow-wallet/nlgnepoeokdfodgjkjiblkadkjbdfmgd" rel="noopener noreferrer" target="_blank" className="btn-download"><img src={DownloadIcon} alt="download icon" /> Install Wallet</a></li>}
                            {addressInfo &&
                                <li className="main-menu dropdown">
                                    <div className="line"></div>
                                    <img className="icon" src={DropdownArrowIcon} alt="drop down icon"></img>
                                    <p className="text-truncate">{addressInfo.address} <span>{addressInfo.balance} EM</span></p>
                                    <ul className="dropdown-content">
                                        <li><a href="/wallet/transfer">Transfer</a></li>
                                        <li><a href="/wallet/stake">Stake</a></li>
                                        <li><a href="/wallet/gas">Gas</a></li>
                                        <li><a href="/wallet/ram">Ram</a></li>
                                        <li><a href="/wallet/vote">Vote</a></li>
                                        <li><a href="/wallet/producer">Producer</a></li>
                                    </ul>
                                </li>
                            }
                        </ul>
                        <div className="logo">
                            <img className="patten-logo-left" src={PattenLogoLeft} alt="patten logo left"></img>
                            <img src={Logo} alt="logo"></img>
                            <img className="patten-logo-right" src={PattenLogoRight} alt="patten logo right"></img>
                        </div>
                    </div>
                </div>
                <div className="search">
                    <div className="container">
                        <div className="wrapper-search">
                            <img src={SearchIcon} alt="search icon"></img>
                            <input className="input-search" type="text" placeholder="Search address, tx hash, block number and token..." />
                            <Select isSearchable={false} className="select-network" classNamePrefix="select-network" value={this.state.networkSelectValue} options={this.state.networkSelectOptions} onChange={(networkSelectValue) => this.setState({ networkSelectValue })}></Select>
                        </div>
                        <div className="noti">
                            <img src={NotiIcon} alt="noti icon"></img>
                            <p dangerouslySetInnerHTML={{ __html: `<b>New Update</b>: <a href="https://empo.io">Empo - Social Network </a> on Empow Blockchain is ready to test` }}></p>
                        </div>
                    </div>
                </div>
            </header>
        )
    }
};

export default connect(state => ({
}), ({
    setNewBlock,
    setAddressInfo
}))(Header)