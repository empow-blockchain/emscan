import React, { Component, Fragment } from 'react'
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

class HomeController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            latestBlockNumber: 0,
            latestBlock: [],
            listProducers: [],
            latestTransactions: [],
            topHolders: [],
            emPrice: 0.001,
            totalVote: 0,
            isLoading: true
        };
    };

    async componentDidMount() {
        ServerAPI.getListProducers().then(listProducers => {
            this.setState({ listProducers })
        })
        ServerAPI.getLatestTransaction().then(latestTransactions => {
            this.setState({ latestTransactions })
        })
        ServerAPI.getTopHolders().then(topHolders => {
            this.setState({ topHolders })
        })
        BlockchainAPI.getTotalVote().then(totalVote => {
            this.setState({ totalVote })
        })

        let interval = setInterval(() => {
            if (this.state.latestBlockNumber !== 0) {
                this.setState({
                    isLoading: false
                })
                clearInterval(interval)
            }
        },100)
    }

    renderLatestBlock() {

        let { latestBlock, latestBlockNumber, listProducers } = this.state

        if (listProducers.length === 0) return;

        if (this.props.block && this.props.block.number !== latestBlockNumber) {
            latestBlock.unshift(this.props.block)
            if (latestBlock.length > 7) {
                latestBlock.pop()
            }
            this.setState({
                latestBlockNumber: this.props.block.number,
                latestBlock
            })
        }

        return (
            <div className="table table-block">
                <div className="table-header">
                    <p className="title">Latest Blocks</p>
                </div>
                <ul className="list-inline table-body">
                    {latestBlock.map((value, index) => {
                        let producer = listProducers.filter(producer => { return producer.pubkey === value.witness })
                        let countryCode = producer[0].loc ? producer[0].loc.toLowerCase() : "us"
                        let avatar = producer[0].avatar ? producer[0].avatar : "https://eosx-apigw.eosx.io/logo-proxy/producer/https%3A%2F%2Fimg.bafang.com%2Fcdn%2Fassets%2Fimgs%2FMjAxOTg%2FC3B8310FFC1B46DA82C8ED7910C2AD61.png"
                        let name = producer[0].name ? producer[0].name : producer[0].pubkey

                        return (
                            <li key={index} className="table-row one-block">
                                <div className="block-number">
                                    <a className="number" href="/block/0">{value.number}</a>
                                    <p className="time">{moment(value.time / 10 ** 6).fromNow()}</p>
                                </div>
                                <div className="witness">
                                    <div className="thumbnail">
                                        <img className="logo" alt="witness" src={avatar}></img>
                                        <FlagIcon className="flag" code={countryCode}></FlagIcon>
                                    </div>
                                    <div className="name">
                                        <p className="producer text-truncate">Witness <a href="/producer">{name}</a></p>
                                        <a href="/block/0" className="txns">{value.tx_count} txns</a>
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
                <div className="table-footer">
                    <div className="center view-more">
                        <a href="/block">View More</a>
                    </div>
                </div>
            </div>
        )
    }

    renderLatestTransaction() {

        const { latestTransactions } = this.state

        if (this.props.block && this.props.block.tx_count > 1 && latestTransactions[0].hash !== this.props.block.transactions[this.props.block.tx_count - 1].hash) {

            for(let i = 1; i < this.props.block.transactions.length; i++) {
                latestTransactions.unshift(this.props.block.transactions[i])
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
                                        <a className="text-truncate" href={`/tx/${value.hash}`}>{value.hash}</a>
                                        <p className="time">{moment(value.time / 10 ** 6).fromNow()}</p>
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
                <div className="table-footer">
                    <div className="center view-more">
                        <a href="/block">View More</a>
                    </div>
                </div>
            </div>
        )
    }

    renderTopHolder() {

        const { topHolders, listProducers, emPrice } = this.state

        return (
            <div className="table table-holder">
                <div className="table-header">
                    <p className="title">Top Holders</p>
                </div>
                <ul className="list-inline table-body">
                    {
                        topHolders.map((value, index) => {

                            // disable admin address
                            if (value.address === "EM2ZsE41ZSeukSxhMyLsb3dZWP7fgFt43L7e5b9hXVBGPU7U4") return false;
                            let isProducer = listProducers.filter(producer => { return producer.address === value.address }).length > 0 ? true : false

                            return (
                                <li key={index} className="table-row one-holder">
                                    <div className="info">
                                        <span className="top-number">{index}</span>
                                        <div className="address">
                                            <a className="text-truncate" href={`/address/${value.address}`}>{value.address}</a>
                                            <p className="type time">{isProducer ? "Producer" : "Address"}</p>
                                        </div>
                                    </div>
                                    <div className="balance">
                                        <p className="balance-em">{Utils.formatCurrency(value.balance, 0)} EM</p>
                                        <p className="balance-usd time">$ {Utils.formatCurrency(value.balance * emPrice, 8)}</p>
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
                <div className="table-footer">
                    <div className="center view-more">
                        <a href="/block">View More</a>
                    </div>
                </div>
            </div>
        )
    }

    renderProducer() {

        const { listProducers, totalVote } = this.state

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
                        listProducers.map((value, index) => {

                            let avatar = value.avatar ? value.avatar : "https://eosx-apigw.eosx.io/logo-proxy/producer/https%3A%2F%2Fimg.bafang.com%2Fcdn%2Fassets%2Fimgs%2FMjAxOTg%2FC3B8310FFC1B46DA82C8ED7910C2AD61.png"
                            let name = value.name ? value.name : value.pubkey

                            return (
                                <li key={index} className="table-row one-producer">
                                    <ul className="list-inline">
                                        <li>
                                            <div className="top-number">{index + 1}</div>
                                        </li>
                                        <li>
                                            <div className="name">
                                                <div className="thumbnail">
                                                    <img className="logo" alt="witness" src={avatar}></img>
                                                </div>
                                                <div className="address">
                                                    <a href={`/address/${value.address}`} className="text-truncate">{name}</a>
                                                    <a href={`/address/${value.address}`} className="text-truncate time">{value.address}</a>
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
                                                <a href={`/wallet/vote/${value.address}`} className="btn btn-default">Vote for Producer</a>
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
                        <a href="/block">View More</a>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <LoadingOverlay
                active={this.state.isLoading}
                spinner={<img src={LoadingIcon}/>}
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
    block: state.app.block
}), ({
}))(HomeController)