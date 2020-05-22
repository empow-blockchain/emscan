import React, { Component } from 'react'
import {connect} from 'react-redux'
import ReactJson from 'react-json-view'

import LoadingIcon from '../assets/images/loading.gif'
import _ from 'lodash'
import FlagIcon from '../components/FlagIcon'
import ActionTag from '../components/ActionTag'
import ActionContent from '../components/ActionContent'
import Proccess from '../components/Proccess'
import Pagination from '../components/Pagination'

import ServerAPI from '../ServerAPI'
import Utils from '../utils/index'
import moment from 'moment'
import LoadingOverlay from 'react-loading-overlay';
import BlockchainAPI from '../BlockchainAPI'
import ButtonCopy from '../components/ButtonCopy'
import {Link} from 'react-router-dom'

class Address extends Component {

    constructor(props) {
        super(props);

        this.state = {
            info: null,
            isLoading: true,
            producerRank: "---",
            producerVote: 0,
            producerBlock: 0,
            producerReward: 0,
            transactions: [],
            ramInfo: null,
            count: 0,
            page: 1,
            pageSize: 20
        };
    };

    async componentDidMount() {
        if (!this.props.match || !this.props.match.params || !this.props.match.params.address) {
            return window.location = "/"
        }

        ServerAPI.getAddress(this.props.match.params.address).then(info => {
            BlockchainAPI.getAddress(info.address).then(accountInfo => {
                info.gas_info = accountInfo.gas_info
                this.setState({ info, isLoading: false })

                this.loadGas()
                if (info.producer_info) this.getProducerInfo(info.address)
                if (info.frozen_balances.length > 0) {
                    setInterval(() => this.countDownFrozenBalance(), 1000)
                }
            })
        }).catch(() => {
            this.setState({ notFound: true, isLoading: false })
        })

        ServerAPI.getCountAddressTransaction(this.props.match.params.address).then(count => {
            this.setState({ count })
        })

        ServerAPI.getAddressTransaction(this.props.match.params.address).then(transactions => {
            this.setState({ transactions })
        })

        BlockchainAPI.getRamInfo().then(ramInfo => {
            this.setState({ ramInfo })
        })
    }

    async componentDidUpdate(prevProps) {
        if(_.isEqual(prevProps, this.props)) {
            return;
        }

        if (!this.props.match || !this.props.match.params || !this.props.match.params.address) {
            return window.location = "/"
        }

        ServerAPI.getAddress(this.props.match.params.address).then(info => {
            BlockchainAPI.getAddress(info.address).then(accountInfo => {
                info.gas_info = accountInfo.gas_info
                this.setState({ info, isLoading: false })

                this.loadGas()
                if (info.producer_info) this.getProducerInfo(info.address)
                if (info.frozen_balances.length > 0) {
                    setInterval(() => this.countDownFrozenBalance(), 1000)
                }
            })
        }).catch(() => {
            this.setState({ notFound: true, isLoading: false })
        })

        ServerAPI.getCountAddressTransaction(this.props.match.params.address).then(count => {
            this.setState({ count })
        })

        ServerAPI.getAddressTransaction(this.props.match.params.address).then(transactions => {
            this.setState({ transactions })
        })

        BlockchainAPI.getRamInfo().then(ramInfo => {
            this.setState({ ramInfo })
        })
    }

    loadGas() {
        setInterval(() => {
            const { info } = this.state
            BlockchainAPI.getAddress(info.address).then(accountInfo => {
                info.gas_info = accountInfo.gas_info
                this.setState({ info })
            })
        }, 1000)
    }

    getProducerInfo(address) {
        const {listProducer} = this.props

        for (let i = 0; i < listProducer.length; i++) {
            if (listProducer[i].address === address) {
                this.setState({
                    producerRank: listProducer[i].rank,
                    producerVote: listProducer[i].votes,
                    producerBlock: listProducer[i].block_produced,
                    producerReward: listProducer[i].block_reward,
                })
                return;
            }
        }
    }

    countDownFrozenBalance() {
        let { info } = this.state
        let now = new Date().getTime();

        for (let i = 0; i < info.frozen_balances.length; i++) {
            const distance = (info.frozen_balances[i].time / 10 ** 6) - now;
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            info.frozen_balances[i].countdown = `${days}d ${hours}h ${minutes}m ${seconds}s`
        }

        this.setState({
            info
        })
    }

    getVoted() {
        const { info } = this.state
        if (!info || info.vote_infos.length === 0) return 0;

        let votes = 0
        for (let i = 0; i < info.vote_infos.length; i++) {
            votes += parseFloat(info.vote_infos[i].votes)
        }

        return Utils.formatCurrency(votes, 8)
    }

    getFrozenBalance() {
        const { info } = this.state
        if (!info || info.frozen_balances.length === 0) return 0;

        let frozenBalance = 0
        for (let i = 0; i < info.frozen_balances.length; i++) {
            frozenBalance += parseFloat(info.frozen_balances[i].amount)
        }

        return Utils.formatCurrency(frozenBalance, 8)
    }

    getSelfPledged() {
        const { info } = this.state
        if (!info || info.gas_info.pledged_info.length === 0) return 0;

        let amount = 0

        for (let i = 0; i < info.gas_info.pledged_info.length; i++) {
            if (info.gas_info.pledged_info[i].pledger === info.address)
                amount += parseFloat(info.gas_info.pledged_info[i].amount)
        }

        return Utils.formatCurrency(amount, 0)
    }

    getPledgedOthers() {
        const { info } = this.state
        if (!info || info.gas_info.pledged_info.length === 0) return 0;

        let amount = 0

        for (let i = 0; i < info.gas_info.pledged_info.length; i++) {
            if (info.gas_info.pledged_info[i].pledger !== info.address)
                amount += parseFloat(info.gas_info.pledged_info[i].amount)
        }

        return Utils.formatCurrency(amount, 0)
    }

    onChangePage(page) {
        this.setState({ page })
        ServerAPI.getAddressTransaction(this.props.match.params.address, page, this.state.pageSize).then(transactions => {
            this.setState({ transactions })
        })
    }

    render() {

        const { info, transactions, isLoading, producerRank, producerVote, producerBlock, producerReward, ramInfo, page, pageSize, count } = this.state

        return (
            <LoadingOverlay
                active={isLoading}
                spinner={<img src={LoadingIcon} alt="LoadingIcon" />}
                className="loading-overlay"
            >

                {
                    info &&
                    <section id="address">
                        <div className="container">
                            <h3 className="address-title">Address <span>{info.address}</span></h3>
                            <ButtonCopy copyText={info.address}></ButtonCopy>

                            {info.producer_info && <div className="card producer-info">
                                <div className="row">
                                    <div className="col-md-7">
                                        <div className="avatar">
                                            <img className="avatar-img" alt="avatar" src={info.producer_info.avatar ? info.producer_info.avatar : "https://ipfs.infura.io/ipfs/QmefC1ttiGQbTjzyqNLQmv7FKRR7cVwJBi64SzUJcPTmjH"}></img>
                                        </div>
                                        <div className="info">
                                            <ul className="list-inline">
                                                <li>Name</li>
                                                <li className="text-truncate">{info.producer_info.name ? info.producer_info.name : info.producer_info.pubkey}</li>
                                            </ul>
                                            <ul className="list-inline">
                                                <li>Location</li>
                                                <li><FlagIcon code={info.producer_info.loc.toLowerCase()}></FlagIcon> {Utils.countryCodeToContryName(info.producer_info.loc)}</li>
                                            </ul>
                                            <ul className="list-inline">
                                                <li>URL</li>
                                                <li className="text-truncate"><a href={info.producer_info.url} target="_blank" without rel="noopener noreferrer">{info.producer_info.url}</a></li>
                                            </ul>
                                            <ul className="list-inline">
                                                <li>Pubkey</li>
                                                <li className="text-truncate">{info.producer_info.pubkey}</li>
                                            </ul>
                                            <ul className="list-inline">
                                                <li>Net ID</li>
                                                <li className="text-truncate">{info.producer_info.netId}</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-md-5">
                                        <div className="more-info">
                                            <div className="rank">
                                                <span>RANK</span>
                                                <p>{producerRank}</p>
                                            </div>
                                            <div className="statistic">
                                                <div className="one-statistic">
                                                    <p className="title">VOTE</p>
                                                    <p className="number">{Utils.formatCurrency(producerVote, 0)}</p>
                                                </div>
                                                <div className="one-statistic">
                                                    <p className="title">BLOCK</p>
                                                    <p className="number">{Utils.formatCurrency(producerBlock, 0)}</p>
                                                </div>
                                                <div className="one-statistic">
                                                    <p className="title">REWARD</p>
                                                    <p className="number">{Utils.formatCurrency(producerReward, 0)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            }

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="card basic-info">
                                        <ul className="list-inline">
                                            <li>Balance</li>
                                            <li className="balance">{Utils.formatCurrency(info.balance, 2)} EM</li>
                                        </ul>
                                        <ul className="list-inline">
                                            <li>On Stake</li>
                                            <li>{Utils.formatCurrency(info.on_stake, 8)} EM <a className="link-to-wallet" href="/wallet/stake">Stake ></a></li>
                                        </ul>
                                        <ul className="list-inline">
                                            <li>Vote Remain</li>
                                            <li>{info.token && info.token.vote ? info.token.vote : 0} VOTE <a className="link-to-wallet" href="/wallet/vote">Vote ></a></li>
                                        </ul>
                                        <ul className="list-inline">
                                            <li>Voted</li>
                                            <li>{this.getVoted()} VOTE <a className="link-to-wallet" href="/wallet/vote">Unvote ></a></li>
                                        </ul>
                                        <ul className="list-inline">
                                            <li>Frozen Balance</li>
                                            <li>
                                                {this.getFrozenBalance()} EM
                                                {info.frozen_balances.length > 0 && <ul className="hide list-inline">
                                                    {info.frozen_balances.map((value, index) => {
                                                        return <li key={index}><p>Amount <span>{value.amount} EM</span></p><p>Remain <span>{value.countdown}</span></p></li>
                                                    })}
                                                </ul>}
                                            </li>
                                        </ul>
                                        <ul className="list-inline">
                                            <li>Token</li>
                                            <li>
                                                {info.token ? Object.keys(info.token).length : 0} Tokens <span className="time">($ 0)</span>
                                                {info.token && Object.keys(info.token).length > 0 &&
                                                    <ul className="hide list-inline">
                                                        {Object.keys(info.token).map((value, index) => {
                                                            return <li key={index}><p>Symbol <span>{value.toUpperCase()}</span></p><p>Amount <span>{Utils.formatCurrency(info.token[value], 8)} {value.toUpperCase()}</span></p></li>
                                                        })}
                                                    </ul>
                                                }
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card resource-info">
                                        <div className="one-resource">
                                            <p className="title">GAS</p>
                                            <Proccess current={info.gas_info.current_total / info.gas_info.limit * 100} limit={100}></Proccess>
                                            <ul className="list-inline remain">
                                                <li>Remain</li>
                                                <li>{Utils.formatCurrency(info.gas_info.current_total, 0)}/{Utils.formatCurrency(info.gas_info.limit, 0)}</li>
                                            </ul>
                                            <ul className="list-inline">
                                                <li>Self Pledged</li>
                                                <li>{this.getSelfPledged()} EM</li>
                                            </ul>
                                            <ul className="list-inline">
                                                <li>Pledged by Others</li>
                                                <li>{this.getPledgedOthers()} EM</li>
                                            </ul>
                                            <ul className="list-inline">
                                                <li>Increase Speed</li>
                                                <li>{info.gas_info.increase_speed} GAS/s</li>
                                            </ul>

                                            <p className="link-to-wallet"><Link to="/wallet/gas">Pledge Gas</Link> or <Link to="/wallet/gas">Unpledge Gas</Link></p>
                                        </div>
                                        <div className="line"></div>
                                        <div className="one-resource">
                                            <p className="title">RAM</p>
                                            <Proccess current={info.ram_info.available / info.ram_info.total * 100} limit={100}></Proccess>
                                            <ul className="list-inline remain">
                                                <li>Remain</li>
                                                <li>{Utils.formatCurrency(info.ram_info.available, 0)}/{Utils.formatCurrency(info.ram_info.total, 0)} Bytes</li>
                                            </ul>
                                            <ul className="list-inline">
                                                <li>Used Ram</li>
                                                <li>{Utils.formatCurrency(info.ram_info.used, 0)} Bytes</li>
                                            </ul>
                                            <ul className="list-inline">
                                                <li>Buy Price</li>
                                                <li>{ramInfo ? ramInfo.buy_price.toFixed(8) : "---"} EM/Bytes</li>
                                            </ul>
                                            <ul className="list-inline">
                                                <li>Sell Price</li>
                                                <li>{ramInfo ? ramInfo.sell_price.toFixed(8) : "---"} EM/Bytes</li>
                                            </ul>
                                            <p className="link-to-wallet"><Link to="/wallet/ram">Buy Ram</Link> or <Link to="/wallet/ram">Sell Ram</Link></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {
                                transactions.length > 0 &&
                                <div className="table table-address-transaction">
                                    <div className="table-header">
                                        <p className="title">Transactions</p>
                                        <Pagination page={page} pageSize={pageSize} count={count} onChangePage={(page) => this.onChangePage(page)}></Pagination>
                                    </div>
                                    <div className="table-title">
                                        <ul className="list-inline">
                                            <li>TxHash</li>
                                            <li>Time</li>
                                            <li>Action</li>
                                            <li>Data</li>
                                        </ul>
                                    </div>
                                    <ul className="list-inline table-body">

                                        {
                                            transactions.map((value, index) => {

                                                return (
                                                    <li key={index} className="table-row one-transaction">
                                                        <ul className="list-inline">
                                                            <li>
                                                                <Link className="text-truncate" style={{ width: "90%" }} to={`/tx/${value.hash}`}>{value.hash}</Link>
                                                            </li>
                                                            <li className="time" style={{ fontSize: 16 }}>{moment(value.time / 10 ** 6).fromNow()}</li>
                                                            <li><ActionTag {...value.actions[0]} fromPage="address" address={info.address}></ActionTag></li>
                                                            <li>
                                                                <ActionContent {...value.actions[0]} tx_receipt={value.tx_receipt}  fromPage="address" address={info.address}></ActionContent>
                                                                {Utils.convertActionContent(value.actions[0].contract, value.actions[0].action_name, value.actions[0].data, value.tx_receipt, "address", info.address) === "" && <ReactJson collapsed={true} displayDataTypes={false} name={false} src={value.actions[0].data}></ReactJson>}
                                                            </li>
                                                        </ul>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                    <div className="table-footer">
                                        <Pagination page={page} pageSize={pageSize} count={count} onChangePage={(page) => this.onChangePage(page)}></Pagination>
                                    </div>
                                </div>
                            }
                        </div>
                    </section>
                }


            </LoadingOverlay>
        )
    }
}

export default connect(state => ({
    listProducer : state.app.listProducer
}),({

}))(Address)