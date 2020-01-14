import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import WalletSidebar from '../components/WalletSidebar'
import Input from '../components/Input'
import { toastr } from 'react-redux-toastr'
import Utils from '../utils/index'
import InstallWalletOverlay from '../components/InstallWalletOverlay';
import FlagIcon from '../components/FlagIcon';
import ReactFlagsSelect from 'react-flags-select';
import EditIcon from '../assets/images/edit-icon.svg'
import SaveIcon from '../assets/images/save-icon.svg'
import UploadIcon from '../assets/images/upload-icon.svg'
import LoadingIcon from '../assets/images/loading.gif'
import ipfsAPI from 'ipfs-api'
import { IPFS_URL, IPFS_GATEWAY_URL } from '../constants/index'
import LoadingOverlay from 'react-loading-overlay';
import ServerAPI from '../ServerAPI';
import { setAddressInfo } from '../reducers/appReducer'
import BlockchainAPI from '../BlockchainAPI'
import _ from 'lodash'
import ConfirmOverlay from '../components/ConfirmOverlay';

class WalletProducer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            to: "",
            amount: 0,
            tokenSelectValue: { value: 'em', label: 'EM (EMPOW)' },
            tokenSelectOptions: [{ value: 'em', label: 'EM (EMPOW)' }],
            memo: "",
            isLoading: false,
            name: "",
            pubkey: "",
            netId: "",
            loc: "US",
            url: "",
            isEdit: false,
            avatar: false,
            isUploading: false,
            isUpdateProducer: false,
            isWithdraw: false,
            voteRewardCanWithdraw: 0,
            blockRewardCanWithdraw:0,
            showVoteRewardWithdraw: false,
            showBlockRewardWithdraw: false,
            withdrawBlockRewardAmount: 0
        };
    };

    componentDidMount() {
        this.init()
    }

    componentDidUpdate(prevProps) {
        if (_.isEqual(prevProps, this.props)) {
            return;
        }

        this.init()
    }

    init() {
        if (this.props.addressInfo && this.props.addressInfo.producer_info && this.props.listProducer.length > 0) {
            BlockchainAPI.getVoteRewardPerVote().then(voteRewardPerVote => {
                BlockchainAPI.getVoteRewardWithdrawnByAddress(this.props.addressInfo.address).then(voteRewardWithdrawn => {
                    this.setState({
                        voteRewardCanWithdraw: voteRewardPerVote * this.props.addressInfo.producer_info.votes - voteRewardWithdrawn
                    })
                })
            })

            ServerAPI.getBlockRewardWithdrawn(this.props.addressInfo.address).then(blockRewardWithdrawn => {
                this.setState({
                    blockRewardCanWithdraw: this.props.addressInfo.producer_info.block_reward - blockRewardWithdrawn,
                    withdrawBlockRewardAmount: this.props.addressInfo.producer_info.block_reward - blockRewardWithdrawn
                })
            })
        }
    }

    async register() {
        this.setState({ isLoading: true })

        const { pubkey, netId, loc, url } = this.state

        const tx = window.empow.callABI("vote_producer.empow", "applyRegister", [this.props.addressInfo.address, pubkey, loc, url, netId, true])
        tx.addApprove("*", "unlimited")
        const handler = window.empow.signAndSend(tx)

        handler.on("failed", (error) => {
            toastr.error('', Utils.getTransactionErrorMessage(error + ""))
            this.setState({ isLoading: false })
        })

        handler.on("success", (res) => {
            toastr.success('', "Register Success", {
                component: (
                    <a target="_blank" rel="noopener noreferrer" href={`/tx/${res.transaction.hash}`}>View Tx</a>
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

    toggleEdit() {
        const { isEdit } = this.state
        const { addressInfo } = this.props

        if (isEdit) {
            this.updateProducer()
        } else {
            this.setState({
                name: addressInfo.producer_info.name ? addressInfo.producer_info.name : addressInfo.producer_info.pubkey,
                pubkey: addressInfo.producer_info.pubkey,
                loc: addressInfo.producer_info.loc,
                url: addressInfo.producer_info.url,
                netId: addressInfo.producer_info.netId,
                isEdit: !isEdit
            })
        }
    }

    uploadAvatar() {
        this.refs.selectAvatar.click()
    }

    onSelectFile(e) {
        var _this = this;
        const file = e.target.files[0]

        if (!file) {
            toastr.error("", "Please select image file")
        }

        this.setState({ isUploading: true })
        var ipfs = ipfsAPI(IPFS_URL, '5001', { protocol: 'https' })
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onloadend = async function () {
            const buf = new Buffer(reader.result) // Convert data into buffer

            ipfs.files.add(buf, (err, result) => {
                if (err) {
                    console.error(err)
                    return
                }

                let url = IPFS_GATEWAY_URL + result[0].hash
                _this.setState({ isUploading: false, avatar: url })
            })
        }
    }

    updateProducer() {
        this.setState({ isUpdateProducer: true })

        const { name, pubkey, loc, url, netId } = this.state
        const { addressInfo } = this.props
        const avatar = this.state.avatar ? this.state.avatar : (addressInfo.producer_info.avatar ? addressInfo.producer_info.avatar : "https://eosx-apigw.eosx.io/logo-proxy/producer/https%3A%2F%2Fimg.bafang.com%2Fcdn%2Fassets%2Fimgs%2FMjAxOTg%2FC3B8310FFC1B46DA82C8ED7910C2AD61.png")

        const tx = window.empow.callABI("vote_producer.empow", "updateProducer", [addressInfo.address, avatar, name, pubkey, loc, url, netId])
        tx.addApprove("*", "unlimited")
        const handler = window.empow.signAndSend(tx)

        handler.on("failed", (error) => {
            toastr.error('', Utils.getTransactionErrorMessage(error + ""))
            this.setState({ isUpdateProducer: false })
        })

        handler.on("success", (res) => {
            toastr.success('', "Update Producer Success", {
                component: (
                    <a target="_blank" rel="noopener noreferrer" href={`/tx/${res.transaction.hash}`}>View Tx</a>
                )
            })
            this.setState({ isUpdateProducer: false, isEdit: false })

            // update info
            ServerAPI.getAddress(addressInfo.address).then(info => {
                this.props.setAddressInfo(info)
            })
        })
    }

    withdrawVoteReward() {
        this.setState({ isWithdraw: true })

        const { addressInfo } = this.props

        const tx = window.empow.callABI("vote_producer.empow", "candidateWithdraw", [addressInfo.address])
        tx.addApprove("*", "unlimited")
        const handler = window.empow.signAndSend(tx)

        handler.on("failed", (error) => {
            toastr.error('', Utils.getTransactionErrorMessage(error + ""))
            this.setState({ isWithdraw: false })
        })

        handler.on("success", (res) => {
            toastr.success('', "Withdraw Vote Reward Success", {
                component: (
                    <a target="_blank" rel="noopener noreferrer" href={`/tx/${res.transaction.hash}`}>View Tx</a>
                )
            })
            this.setState({ isWithdraw: false, showVoteRewardWithdraw: false, voteRewardCanWithdraw: 0 })

            // updateAddressInfo
            ServerAPI.getAddress(addressInfo.address).then(info => this.props.setAddressInfo(info))
        })
    }

    withdrawBlockReward() {
        this.setState({ isWithdraw: true })

        const { withdrawBlockRewardAmount} = this.state
        const { addressInfo  } = this.props

        const tx = window.empow.callABI("bonus.empow", "exchangeEMPOW", [addressInfo.address, withdrawBlockRewardAmount])
        tx.addApprove("*", "unlimited")
        const handler = window.empow.signAndSend(tx)

        handler.on("failed", (error) => {
            toastr.error('', Utils.getTransactionErrorMessage(error + ""))
            this.setState({ isWithdraw: false })
        })

        handler.on("success", (res) => {
            toastr.success('', "Withdraw Block Reward Success", {
                component: (
                    <a target="_blank" rel="noopener noreferrer" href={`/tx/${res.transaction.hash}`}>View Tx</a>
                )
            })
            this.setState({ isWithdraw: false, showBlockRewardWithdraw: false })
            this.init()

            // updateAddressInfo
            ServerAPI.getAddress(addressInfo.address).then(info => this.props.setAddressInfo(info))
        })
    }

    renderBecomeProducer() {

        const { pubkey, netId, loc, url, isLoading } = this.state
        const { addressInfo } = this.props

        return (
            <div className="card">
                {!addressInfo && <InstallWalletOverlay></InstallWalletOverlay>}
                <h3 className="title">Become Producer</h3>
                <p className="time note">Your wallet must actived (If your wallet just created you must transfer some EM to activate it)</p>
                <div className="how-to">
                    <div className="one-step">
                        <span className="number">1</span>
                        <div className="content">
                            <p>Run Full Node</p>
                            <p><a href="https://github.com/empow-blockchain/go-empow#empow-blockchain---social-network-on-blockchain" target="_blank" rel="noopener noreferrer">How to run full node empow blockchain</a></p>
                        </div>
                    </div>
                    <div className="one-step">
                        <span className="number">2</span>
                        <div className="content">
                            <p>Register Producer</p>
                            <p>Copy <b>Network Public Key</b> and <b>Network ID</b> to form bellow and Register</p>
                        </div>
                    </div>
                    <div className="one-step">
                        <span className="number">3</span>
                        <div className="content">
                            <p>Contact Our</p>
                            <p>Contact <a href="https://t.me/empowofficial" target="_blank" rel="noopener noreferrer">Our Telegram</a> if you have any problems</p>
                        </div>
                    </div>
                </div>
                <div className="register">
                    <div className="row">
                        <div className="col-md-6">
                            <Input className="pubkey" title="Network Public Key" placeholder="Paste your Network Public Key" type="text" value={pubkey} onChange={(e) => this.setState({ pubkey: e.target.value })}></Input>
                            <Input className="url" title="Your Website" placeholder="https://example.com" type="text" value={url} onChange={(e) => this.setState({ url: e.target.value })}></Input>
                        </div>
                        <div className="col-md-6">
                            <Input className="netId" title="Network ID" placeholder="Paste your Network ID" type="text" value={netId} onChange={(e) => this.setState({ netId: e.target.value })}></Input>
                            <p className="loc">Select location</p>
                            <ReactFlagsSelect className="select-location" searchable={true} defaultCountry={loc} onSelect={(countryCode) => this.setState({ loc: countryCode })} />
                        </div>
                        <button className={`btn btn-color ${isLoading ? "btn-color-loading" : ""}`} onClick={() => this.register()}>Register</button>
                    </div>
                </div>
            </div>
        )
    }

    renderProducer() {

        const { isEdit, avatar, name, pubkey, url, netId, loc, isUploading, isUpdateProducer, voteRewardCanWithdraw, blockRewardCanWithdraw, showBlockRewardWithdraw, showVoteRewardWithdraw, isWithdraw, withdrawBlockRewardAmount } = this.state
        const { addressInfo, listProducer } = this.props


        const producer = listProducer.filter(producer => (producer.address === addressInfo.address))
        let rank = 0;
        if (producer.length > 0) rank = producer[0].rank

        return (
            <Fragment>
                <div className="card producer-info">
                    <LoadingOverlay
                        active={isUpdateProducer}
                        spinner={<img src={LoadingIcon} alt="LoadingIcon" />}
                        className="loading-update-producer"
                    >
                        <div className="avatar">
                            <LoadingOverlay
                                active={isUploading}
                                spinner
                                className="loading-overlay"
                            />
                            <img className="avatar-img" alt="avatar" src={avatar ? avatar : (addressInfo.producer_info.avatar ? addressInfo.producer_info.avatar : "https://eosx-apigw.eosx.io/logo-proxy/producer/https%3A%2F%2Fimg.bafang.com%2Fcdn%2Fassets%2Fimgs%2FMjAxOTg%2FC3B8310FFC1B46DA82C8ED7910C2AD61.png")}></img>
                            {isEdit && <p className="upload" onClick={this.uploadAvatar.bind(this)}><input onChange={this.onSelectFile.bind(this)} type="file" accept=".jpg,.png,.jpeg" ref="selectAvatar" style={{ display: "none" }}></input><img src={UploadIcon} alt="UploadIcon" />Upload Avatar</p>}
                        </div>
                        <div className="info">
                            <ul className="list-inline">
                                <li>Name</li>
                                {!isEdit && <li className="text-truncate">{addressInfo.producer_info.name ? addressInfo.producer_info.name : addressInfo.producer_info.pubkey}</li>}
                                {isEdit && <li><Input type="text" value={name} onChange={(e) => this.setState({ name: e.target.value })}></Input></li>}
                            </ul>
                            <ul className="list-inline">
                                <li>Location</li>
                                {!isEdit && <li><FlagIcon code={addressInfo.producer_info.loc.toLowerCase()}></FlagIcon> {Utils.countryCodeToContryName(addressInfo.producer_info.loc)}</li>}
                                {isEdit && <li><ReactFlagsSelect className="select-location" searchable={true} defaultCountry={loc} onSelect={(countryCode) => this.setState({ loc: countryCode })} /></li>}
                            </ul>
                            <ul className="list-inline">
                                <li>URL</li>
                                {!isEdit && <li className="text-truncate"><a href={addressInfo.producer_info.url} target="_blank" rel="noopener noreferrer">{addressInfo.producer_info.url}</a></li>}
                                {isEdit && <li><Input type="text" value={url} onChange={(e) => this.setState({ url: e.target.value })}></Input></li>}
                            </ul>
                            <ul className="list-inline">
                                <li>Pubkey</li>
                                {!isEdit && <li className="text-truncate">{addressInfo.producer_info.pubkey}</li>}
                                {isEdit && <li><Input type="text" value={pubkey} onChange={(e) => this.setState({ pubkey: e.target.value })}></Input></li>}
                            </ul>
                            <ul className="list-inline">
                                <li>Net ID</li>
                                {!isEdit && <li className="text-truncate">{addressInfo.producer_info.netId}</li>}
                                {isEdit && <li><Input type="text" value={netId} onChange={(e) => this.setState({ netId: e.target.value })}></Input></li>}
                            </ul>
                        </div>
                        <button className="btn btn-default btn-edit" onClick={this.toggleEdit.bind(this)}>
                            {!isEdit && <Fragment><img className="icon" src={EditIcon} alt="EditIcon" />Edit</Fragment>}
                            {isEdit && <Fragment><img className="icon" src={SaveIcon} alt="SaveIcon" />Save</Fragment>}
                        </button>
                    </LoadingOverlay>
                </div>
                <div className="card producer-statistic">
                    <LoadingOverlay
                        active={isWithdraw}
                        spinner={<img src={LoadingIcon} alt="LoadingIcon" />}
                        className="loading-overlay"
                    >
                        <ConfirmOverlay onOk={() => this.withdrawVoteReward()} onCancel={() => this.setState({ showVoteRewardWithdraw: false })} title={<span>You will receive <b>{voteRewardCanWithdraw.toFixed(8)} EM</b></span>} isShow={showVoteRewardWithdraw}></ConfirmOverlay>
                        <ConfirmOverlay moreComponent={<Input className="amount" title="WITHDRAW AMOUNT" type="text" value={withdrawBlockRewardAmount} onChange={(e) => this.setState({ withdrawBlockRewardAmount: e.target.value })} suffix="EM"></Input>} onOk={() => this.withdrawBlockReward()} onCancel={() => this.setState({ showBlockRewardWithdraw: false })} isShow={showBlockRewardWithdraw}></ConfirmOverlay>
                        <div className="statistic">
                            <div className="one-statistic">
                                <p className="title">RANK</p>
                                <p className="number">{Utils.formatCurrency(rank, 8)}</p>
                            </div>
                            <div className="one-statistic">
                                <p className="title">VOTE</p>
                                <p className="number">{Utils.formatCurrency(addressInfo.producer_info.votes, 8)}</p>
                            </div>
                            <div className="one-statistic">
                                <p className="title">BLOCK PRODUCED</p>
                                <p className="number">{Utils.formatCurrency(addressInfo.producer_info.block_produced, 8)}</p>
                            </div>
                            <div className="one-statistic">
                                <p className="title">BLOCK REWARD</p>
                                <p className="number">{Utils.formatCurrency(addressInfo.producer_info.block_reward, 2)} EM</p>
                            </div>
                        </div>
                        <div className="statistic" style={{ marginTop: 20, border: "none" }}>
                            <div className="one-statistic">
                                <p className="title">BLOCK REWARD CAN WITHDRAW</p>
                                <p className="number">{Utils.formatCurrency(blockRewardCanWithdraw, 2)} EM <button onClick={() => this.setState({ showBlockRewardWithdraw: true })} className="btn btn-default">Withdraw</button></p>
                            </div>
                            <div className="one-statistic">
                                <p className="title">VOTE REWARD CAN WITHDRAW</p>
                                <p className="number">{Utils.formatCurrency(voteRewardCanWithdraw, 2)} EM <button onClick={() => this.setState({ showVoteRewardWithdraw: true })} className="btn btn-default">Withdraw</button></p>
                            </div>
                        </div>
                    </LoadingOverlay>
                </div>
            </Fragment>
        )
    }

    render() {
        const { addressInfo } = this.props

        return (
            <section id="wallet-producer">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3">
                            <WalletSidebar active="producer"></WalletSidebar>
                        </div>
                        <div className="col-md-9">
                            {(!addressInfo || (addressInfo && !addressInfo.producer_info)) && this.renderBecomeProducer()}
                            {(addressInfo && addressInfo.producer_info) && this.renderProducer()}
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default connect(state => ({
    addressInfo: state.app.addressInfo,
    listProducer: state.app.listProducer
}), ({
    setAddressInfo: setAddressInfo
}))(WalletProducer)