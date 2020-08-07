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
import ReCAPTCHA from "react-google-recaptcha";
import { toastr } from 'react-redux-toastr'

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
            showMenu: false,
            isAddressActived: true,
            isLoadingActiveWallet: false,
            captchaCode: false,
            typeUsername: "",
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
            this.setState({
                myAddress: address
            })

            if (address) {
                ServerAPI.getAddress(address).then(addressInfo => {
                    this.props.setAddressInfo(addressInfo)
                    this.setState({
                        addressInfo
                    })
                }).catch(err => {
                    this.setState({
                        isAddressActived: false
                    })
                    return;
                })
            }
        }
    }

    onChangeSearch(e) {
        this.setState({ searchValue: e.target.value })
    }

    onSearch() {
        var {searchValue} = this.state

        if (searchValue.length === 49 && searchValue[0] === "E" && searchValue[1] === "M") {
            this.setState({
                redirectComponent: <Redirect to={"/address/" + searchValue} />
            })
        }

        if (searchValue.length === 44) {
            this.setState({
                redirectComponent: <Redirect to={"/tx/" + searchValue} />
            })
        }

        ServerAPI.getAddressByUsername(searchValue).then(accountInfo => {
            if (accountInfo && accountInfo.address) {
                this.setState({
                    redirectComponent: <Redirect to={"/address/" + accountInfo.address} />
                })
            }
        }).catch(err => {
        })
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

    activeWallet = async () => {
        const { captchaCode, typeUsername, myAddress } = this.state
        const isValid = Utils.checkNormalUsername(typeUsername)

        if (isValid !== true) {
            return toastr.error('', isValid)
        }

        if (!captchaCode) {
            return toastr.error('', "Please check robot")
        }

        try {
            var address = await ServerAPI.getAddressByUsername(`newbie.${typeUsername}`)
            if (address) {
                return toastr.error('', "This username has already been used")
            }
        } catch (e) {

        }

        this.setState({
            isLoadingActiveWallet: true
        })

        ServerAPI.activeAddress(myAddress, captchaCode).then(res => {
            // set username
            const txBuyUsername = window.empow.callABI("auth.empow", "addNormalUsername", [myAddress, typeUsername])
            const txSaveUsername = window.empow.callABI("auth.empow", "selectUsername", ["newbie." + typeUsername])
            Utils.sendAction(txBuyUsername).then(() => {
                // hide modal
                this.setState({
                    isAddressActived: true,
                })

                Utils.sendAction(txSaveUsername)
            }).catch(err => {
                toastr.error('', err)
            })

            let interval = setInterval(() => {
                ServerAPI.getAddress(myAddress).then(addressInfo => {
                    if (addressInfo.username) {
                        this.setState({
                            addressInfo
                        })

                        this.props.setAddressInfo(addressInfo)

                        clearInterval(interval)
                    }
                })
            }, 1000)
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

    renderModelActiveAddress() {

        const { isLoadingActiveWallet, typeUsername } = this.state

        return (
            <div className="overlay">
                <div className="waper">
                    <div className="dark-range"></div>
                    <div className="active-wallet">
                        <p className="title">Type your username</p>
                        <div className="input">
                            <span>newbie.</span>
                            <input onChange={(e) => this.setState({ typeUsername: e.target.value.toLowerCase() })} value={typeUsername} autoFocus={true} className="username-input" type="text"></input>
                        </div>
                        <ReCAPTCHA
                            sitekey="6LexM9UUAAAAAGIw-3nE_r7cC9hW9A90UoexM1ps"
                            onChange={(captchaCode) => this.setState({ captchaCode })}
                            className="recaptcha"
                        />
                        <button onClick={() => this.activeWallet()} className="btn-general-1" disabled={isLoadingActiveWallet}>{isLoadingActiveWallet ? "Saving..." : "Save"}</button>
                    </div>
                </div>
            </div>
        )
    }

    render() {

        const { blockNumber, countTransaction, txCount, EMTokenInfo, addressInfo, searchValue, redirectComponent, isAddressActived, myAddress } = this.state

        return (
            <header>
                {redirectComponent && redirectComponent}
                <div className="container">
                    <div className="wrapper">
                        <ul className="top-header">
                            <li>BLOCK NUMBER: {Utils.formatCurrency(blockNumber)}</li>
                            <li>TRANSACTION: {Utils.formatCurrency(countTransaction)}</li>
                            <li>TPS: {txCount}/374</li>
                            <li>CIRCULATING SUPPLY: {EMTokenInfo ? Utils.formatCurrency(EMTokenInfo.supply - 4000000000, 0) : 0} EM</li>
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
                            <input onChange={(e) => this.onChangeSearch(e)} value={searchValue} className="input-search" type="text" placeholder="Search address, tx hash, block number and token..." />
                            <button onClick={() => this.onSearch()} className="btn-seach">Search</button>
                            <Select isSearchable={false} className="select-network" classNamePrefix="select-network" value={this.state.networkSelectValue} options={this.state.networkSelectOptions} onChange={(networkSelectValue) => this.changeNetwork(networkSelectValue)}></Select>
                        </div>
                        <div className="noti">
                            <img src={NotiIcon} alt="noti icon"></img>
                            <div className="html" dangerouslySetInnerHTML={{ __html: `<b>New Update</b>: <a href="${EMPO_URL}" target="_blank">Empow - Social Network </a> on Empow Blockchain is ready` }}></div>
                        </div>
                    </div>
                </div>

                {(!isAddressActived && myAddress) && this.renderModelActiveAddress()}
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