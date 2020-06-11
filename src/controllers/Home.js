import React, { Component } from 'react'
import { connect } from 'react-redux';

import LoadingIcon from '../assets/images/loading.gif'

import FlagIcon from '../components/FlagIcon'
import ActionTag from '../components/ActionTag'
import Proccess from '../components/Proccess'

import ServerAPI from '../ServerAPI'
import Utils from '../utils/index'
import moment from 'moment'
import LoadingOverlay from 'react-loading-overlay';
import BlockchainAPI from '../BlockchainAPI';
import {Link} from 'react-router-dom'
import _ from 'lodash'
import { ADMIN_ADDRESS } from '../constants';

class HomeController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            latestTransactions: [],
            topHolders: [],
            emPrice: 0.001,
            totalVote: 0,
            isLoading: false
        };
    };

    async componentDidMount() {
        ServerAPI.getTransactions().then(latestTransactions => {
            this.setState({ latestTransactions })
        })
        ServerAPI.getTopHolders().then(topHolders => {
            this.setState({ topHolders })
        })
        BlockchainAPI.getTotalVote().then(totalVote => {
            this.setState({ totalVote })
        })
    }

    async componentDidUpdate (prevProps) {
        if(_.isEqual(prevProps, this.props)) {
            return;
        }
    }

    renderLatestBlock() {

        let { listProducer,latestBlock } = this.props

        if (listProducer.length === 0 || latestBlock.length === 0) return;

        return (
            <div className="table table-block">
                <div className="table-header">
                    <p className="title">Latest Blocks</p>
                </div>
                <ul className="list-inline table-body">
                    {latestBlock.map((value, index) => {
                        let producer = listProducer.filter(producer => { return producer.pubkey === value.witness })
                        if(producer.length === 0) return null
                        let countryCode = producer[0].loc ? producer[0].loc.toLowerCase() : "us"
                        let avatar = producer[0].avatar ? producer[0].avatar : "https://ipfs.infura.io/ipfs/QmefC1ttiGQbTjzyqNLQmv7FKRR7cVwJBi64SzUJcPTmjH"
                        let name = producer[0].name ? producer[0].name : producer[0].pubkey

                        return (
                            <li key={index} className="table-row one-block">
                                <div className="block-number">
                                    <Link className="number" to={`/block/${value.number}`}>{value.number}</Link>
                                    <p className="time">{moment(value.time / 10 ** 6).fromNow()}</p>
                                </div>
                                <div className="witness">
                                    <div className="thumbnail">
                                        <img className="logo" alt="witness" src={avatar}></img>
                                        <FlagIcon className="flag" code={countryCode}></FlagIcon>
                                    </div>
                                    <div className="name">
                                        <p className="producer text-truncate">Witness <Link to={`/address/${producer[0].address}`}>{name}</Link></p>
                                        <Link to={`/block/${value.number}`} className="txns">{value.tx_count} txns</Link>
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
                <div className="table-footer">
                    <div className="center view-more">
                        <Link to="/blocks">View More</Link>
                    </div>
                </div>
            </div>
        )
    }

    renderLatestTransaction() {

        const { latestTransactions } = this.state
        const { latestBlock } = this.props
        const lastBlock = latestBlock[0]

        if (lastBlock && lastBlock.transactions && lastBlock.tx_count > 1 && latestTransactions.length > 0 && latestTransactions[0].hash !== lastBlock.transactions[lastBlock.tx_count - 1].hash) {

            for(let i = 1; i < lastBlock.transactions.length; i++) {
                latestTransactions.unshift(lastBlock.transactions[i])
                latestTransactions.pop()
            }

            this.setState({
                latestTransactions
            })
        }

        return (
            <div className="table table-transaction">
                <div className="table-header">
                    <p className="title">Latest Transactions</p>
                </div>
                <ul className="list-inline table-body">
                    {
                        latestTransactions.map((value, index) => {
                            return (
                                <li key={index} className="table-row one-transaction">
                                    <ActionTag {...value.actions[0]} fromPage="home"></ActionTag>

                                    <div className="info">
                                        <Link className="text-truncate" to={`/tx/${value.hash}`}>{value.hash}</Link>
                                        <p className="time">{moment(value.time / 10 ** 6).fromNow()}</p>
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
                <div className="table-footer">
                    <div className="center view-more">
                        <Link to="/txs">View More</Link>
                    </div>
                </div>
            </div>
        )
    }

    renderTopHolder() {

        const { topHolders } = this.state
        const {listProducer} = this.props

        return (
            <div className="table table-holder">
                <div className="table-header">
                    <p className="title">Top Holders</p>
                </div>
                <ul className="list-inline table-body">
                    {
                        topHolders.map((value, index) => {

                            // disable admin address
                            if (value.address === ADMIN_ADDRESS) return false;
                            let isProducer = listProducer.filter(producer => { return producer.address === value.address }).length > 0 ? true : false

                            return (
                                <li key={index} className="table-row one-holder">
                                    <div className="info">
                                        <span className="top-number">{index}</span>
                                        <div className="address">
                                            <Link className="text-truncate" to={`/address/${value.address}`}>{value.address}</Link>
                                            <p className="type time">{isProducer ? "Producer" : "Address"}</p>
                                        </div>
                                    </div>
                                    <div className="balance">
                                        <p className="balance-em">{Utils.formatCurrency(value.balance, 2)} EM</p>
                                        {/* <p className="balance-usd time">$ {Utils.formatCurrency(value.balance * emPrice, 8)}</p> */}
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
                <div className="table-footer">
                    <div className="center view-more">
                        <Link to="/holders">View More</Link>
                    </div>
                </div>
            </div>
        )
    }

    renderProducer() {

        const { totalVote } = this.state
        const {listProducer} = this.props

        return (
            <div className="table table-producer">
                <div className="table-header">
                    <p className="title">Top Producers</p>
                </div>
                <div className="table-title">
                    <ul className="list-inline">
                        <li>Rank</li>
                        <li>Name</li>
                        <li>Location</li>
                        <li>Vote</li>
                        <li>Status</li>
                        <li>Blocks</li>
                        <li>Block Reward</li>
                        <li></li>
                    </ul>
                </div>
                <ul className="list-inline table-body">

                    {
                        listProducer.map((value, index) => {

                            let avatar = value.avatar ? value.avatar : "https://ipfs.infura.io/ipfs/QmefC1ttiGQbTjzyqNLQmv7FKRR7cVwJBi64SzUJcPTmjH"
                            let name = value.name ? value.name : value.pubkey

                            return (
                                <li key={index} className="table-row one-producer">
                                    <ul className="list-inline">
                                        <li>
                                            <div className="top-number">{value.rank}</div>
                                        </li>
                                        <li>
                                            <div className="name">
                                                <div className="thumbnail">
                                                    <img className="logo" alt="witness" src={avatar}></img>
                                                </div>
                                                <div className="address">
                                                    <Link to={`/address/${value.address}`} className="text-truncate">{name}</Link>
                                                    <Link to={`/address/${value.address}`} className="text-truncate time">{value.address}</Link>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="location">
                                                <FlagIcon code={value.loc.toLowerCase()}></FlagIcon>
                                                <p>{Utils.countryCodeToContryName(value.loc)}</p>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="vote">
                                                <p>{Utils.formatCurrency(value.votes)} <span className="time">({(value.votes / totalVote * 100).toFixed(2)}%)</span></p>
                                                <Proccess current={value.votes / totalVote * 100} limit={100}></Proccess>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="status">
                                                {value.status === 0 && <div className="status-pending">Pending</div>}
                                                {value.status === 1 && <div className="status-success">Ready</div>}
                                                {(value.status === 2 || value.statue === 3) && <div className="status-error">Not Ready</div>}
                                            </div>
                                        </li>
                                        <li>
                                            <div className="block">
                                                <p>{Utils.formatCurrency(value.block_produced, 0)}</p>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="block-reward">
                                                <p>{Utils.formatCurrency(value.block_reward, 0)} EM</p>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="btn-vote">
                                                <Link to={`/wallet/vote/${value.address}`} className="btn btn-default">Vote for Producer</Link>
                                            </div>
                                        </li>
                                    </ul>
                                </li>
                            )
                        })
                    }
                </ul>
                <div className="table-footer">
                    <div className="center view-more">
                        <Link to="/producer">View More</Link>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <LoadingOverlay
                active={this.state.isLoading}
                spinner={<img src={LoadingIcon} alt="LoadingIcon"/>}
                className="loading-overlay"
            >
                <section id="home">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-4">
                                {this.renderLatestBlock()}
                            </div>
                            <div className="col-md-4">
                                {this.renderLatestTransaction()}
                            </div>
                            <div className="col-md-4">
                                {this.renderTopHolder()}
                            </div>
                            <div className="col-md-12">
                                {this.renderProducer()}
                            </div>
                        </div>
                    </div>
                </section>
            </LoadingOverlay>
        )
    }
}

export default connect(state => ({
    latestBlock: state.app.latestBlock,
    listProducer: state.app.listProducer
}), ({
}))(HomeController)