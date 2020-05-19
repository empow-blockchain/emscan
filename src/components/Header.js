import React, { Component } from 'react'
import { connect } from 'react-redux';
import Select from 'react-select';
import io from 'socket.io-client'
import { SOCKET_ENDPOINT, DEFAULT_NETWORK } from '../constants/index'
import {
    setLatestBlock,
    setAddressInfo,
    setListProducer
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
import { Link, Redirect } from 'react-router-dom'
import { EMPO_URL } from '../constants/index'
import List from '../assets/images/list.svg';
class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            networkSelectValue: { value: DEFAULT_NETWORK.toLowerCase(), label: DEFAULT_NETWORK },
            networkSelectOptions: [
                { value: 'mainnet', label: 'MAINNET' },
                { value: 'testnet', label: 'TESTNET' }
            ],
            blockNumber: 0,
            countTransaction: 0,
            txCount: 0,
            EMTokenInfo: null,
            addressInfo: null,
            searchValue: "",
            redirectComponent: false,
            showMenu: false
        }
    };

    async componentDidMount() {
        let socket = io(SOCKET_ENDPOINT)

        socket.on("connect", (res) => {
            console.log("Connected to socket");
            socket.emit("get_new_block", null)
        })

        ServerAPI.getBlocks(1, 7).then(latestBlock => {
            for (let i = latestBlock.length - 1; i >= 0; i--) {
                this.props.setLatestBlock(latestBlock[i])
            }

            socket.on("res_new_block", (data) => {
                this.props.setLatestBlock(data)
                this.setState({
                    blockNumber: data.number,
                    countTransaction: parseInt(this.state.countTransaction) + (data.tx_count - 1),
                    txCount: data.tx_count
                })
            })
        })

        ServerAPI.getCountTransaction().then(countTransaction => {
            this.setState({ countTransaction })
        })

        ServerAPI.getTokenInfo("em").then(EMTokenInfo => {
            this.setState({ EMTokenInfo })
        })

        ServerAPI.getListProducers().then(listProducer => {
            for (let i = 0; i < listProducer.length; i++) {
                listProducer[i].rank = i + 1
            }
            this.props.setListProducer(listProducer)
        })

        if (window.empow) {
            const address = await window.empow.enable()

            if (address) {

                let addressInfo = {
                    address,
                    balance: 0
                }

                let result = await ServerAPI.getAddress(address)
                if (result) addressInfo = result

                this.props.setAddressInfo(addressInfo)
                this.setState({
                    addressInfo
                })
            }
        }
    }

    onSearch(e) {
        this.setState({ searchValue: e.target.value })

        if (e.target.value.length === 49 && e.target.value[0] === "E" && e.target.value[1] === "M") {
            this.setState({
                redirectComponent: <Redirect to={"/address/" + e.target.value} />
            })
        }

        if (e.target.value.length === 44) {
            this.setState({
                redirectComponent: <Redirect to={"/tx/" + e.target.value} />
            })
        }
    }

    changeNetwork(option) {
        if (option.value === "testnet") {
            window.location = "https://testnet.emscan.io"
        }

        if (option.value === "mainnet") {
            window.location = "https://emscan.io"
        }
    }

    showMenu = () => {
        this.setState({
            showMenu: !this.state.showMenu
        })
    }

    renderMenu() {
        const { addressInfo } = this.state
        return (
            <ul className="list-inline-app">
                {addressInfo && <li className="main-menu"><Link to={`/address/${addressInfo.address}`}>{addressInfo.address.substring(0, 15) + '...'}</Link></li>}
                {addressInfo && <li className="main-menu">{Utils.formatCurrency(addressInfo.balance, 2)} EM</li>}
                <li className="main-menu"><Link to="/">Home</Link></li>
                <li className="main-menu"><Link to="/blocks">Block</Link></li>
                <li className="main-menu"><Link to="/producer">Producer</Link></li>
                <li className="main-menu"><Link to="/wallet/stake">Stake</Link></li>
                <li className="main-menu"><Link to="/txs">Txs</Link></li>
                {!addressInfo && <li className="main-menu"><a href="https://chrome.google.com/webstore/detail/empow-wallet/nlgnepoeokdfodgjkjiblkadkjbdfmgd" rel="noopener noreferrer" target="_blank" className="btn-download"><img src={DownloadIcon} alt="download icon" /> Install Wallet</a></li>}

                {addressInfo && <li className="main-menu"><Link to="/wallet/gas">Gas</Link></li>}
                {addressInfo && <li className="main-menu"><Link to="/wallet/ram">Ram</Link></li>}
                {addressInfo && <li className="main-menu"><Link to="/wallet/producer">Producer</Link></li>}
                {addressInfo && <li className="main-menu"><Link to="/wallet/vote">Vote</Link></li>}
            </ul>
        )
    }

    render() {

        const { blockNumber, countTransaction, txCount, EMTokenInfo, addressInfo, searchValue, redirectComponent } = this.state

        return (
            <header>
                {redirectComponent && redirectComponent}
                <div className="container">
                    <div className="wrapper">
                        <ul className="top-header">
                            <li>BLOCK NUMBER: {Utils.formatCurrency(blockNumber)}</li>
                            <li>TRANSACTION: {Utils.formatCurrency(countTransaction)}</li>
                            <li>TPS: {txCount}/374</li>
                            <li>CIRCULATING SUPPLY: {EMTokenInfo ? Utils.formatCurrency(EMTokenInfo.supply, 0) : 0} EM</li>
                        </ul>
                    </div>
                </div>
                <div className="navbar">
                    <img onClick={this.showMenu} className="list" src={List} alt="photos"></img>

                    <img className="patten-left" src={PattenLeft} alt="patten left"></img>
                    <img className="patten-right" src={PattenRight} alt="patten right"></img>
                    <div className="container">
                        <ul className="list-inline">
                            <li className="main-menu"><Link to="/">Home</Link></li>
                            <li className="main-menu"><Link to="/blocks">Block</Link></li>
                            <li className="main-menu"><Link to="/producer">Producer</Link></li>
                            <li className="main-menu"><Link to="/wallet/stake">Stake</Link></li>
                            <li className="main-menu"><Link to="/txs">Txs</Link></li>
                            {!addressInfo && <li className="main-menu"><a href="https://chrome.google.com/webstore/detail/empow-wallet/nlgnepoeokdfodgjkjiblkadkjbdfmgd" rel="noopener noreferrer" target="_blank" className="btn-download"><img src={DownloadIcon} alt="download icon" /> Install Wallet</a></li>}
                            {addressInfo &&
                                <li className="main-menu dropdown">
                                    <div className="line"></div>
                                    <img className="icon" src={DropdownArrowIcon} alt="drop down icon"></img>
                                    <Link to={`/address/${addressInfo.address}`} className="address text-truncate">{addressInfo.address} <span>{Utils.formatCurrency(addressInfo.balance, 2)} EM</span></Link>
                                    <ul className="dropdown-content">
                                        <li><Link to="/wallet/transfer">Transfer</Link></li>
                                        <li><Link to="/wallet/stake">Stake</Link></li>
                                        <li><Link to="/wallet/gas">Gas</Link></li>
                                        <li><Link to="/wallet/ram">Ram</Link></li>
                                        <li><Link to="/wallet/producer">Producer</Link></li>
                                        <li><Link to="/wallet/vote">Vote</Link></li>
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

                    {this.state.showMenu && this.renderMenu()}
                </div>
                <div className="search">
                    <div className="container">
                        <div className="wrapper-search">
                            <img src={SearchIcon} alt="search icon"></img>
                            <input onChange={(e) => this.onSearch(e)} value={searchValue} className="input-search" type="text" placeholder="Search address, tx hash, block number and token..." />
                            <Select isSearchable={false} className="select-network" classNamePrefix="select-network" value={this.state.networkSelectValue} options={this.state.networkSelectOptions} onChange={(networkSelectValue) => this.changeNetwork(networkSelectValue)}></Select>
                        </div>
                        <div className="noti">
                            <img src={NotiIcon} alt="noti icon"></img>
                            <div className="html" dangerouslySetInnerHTML={{ __html: `<b>New Update</b>: <a href="${EMPO_URL}" target="_blank">Empo - Social Network </a> on Empow Blockchain is ready to test` }}></div>
                        </div>
                    </div>
                </div>
            </header>
        )
    }
};

export default connect(state => ({
}), ({
    setLatestBlock,
    setAddressInfo,
    setListProducer
}))(Header)