import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import ReactJson from 'react-json-view'

import LoadingIcon from '../assets/images/loading.gif'

import FlagIcon from '../components/FlagIcon'
import ActionTag from '../components/ActionTag'
import ActionContent from '../components/ActionContent'
import Proccess from '../components/Proccess'

import ServerAPI from '../ServerAPI'
import Utils from '../utils/index'
import moment from 'moment'
import LoadingOverlay from 'react-loading-overlay';
import BlockchainAPI from '../BlockchainAPI';

class Address extends Component {

    constructor(props) {
        super(props);

        this.state = {
            info: null,
            isLoading: true,
            producerRank: "---",
            producerVote: 0,
            producerBlock: 0,
            producerReward: 0
        };
    };

    async componentDidMount() {
        if (!this.props.match || !this.props.match.params || !this.props.match.params.address) {
            return window.location = "/"
        }

        ServerAPI.getAddress(this.props.match.params.address).then(info => {
            this.setState({ info, isLoading: false })

            if (info.producer_info.length > 0) this.getProducerRank(info.address)
            if (info.frozen_balances.length > 0) {
                setInterval(() => this.countDownFrozenBalance(), 1000)
            }
        }).catch(() => {
            this.setState({ notFound: true, isLoading: false })
        })
    }

    getProducerRank(address) {
        ServerAPI.getListProducers().then(listProducer => {
            for (let i = 0; i < listProducer.length; i++) {
                if (listProducer[i].address === address) {
                    this.setState({
                        producerRank: i + 1,
                        producerVote: listProducer[i].votes,
                        producerBlock: listProducer[i].block_produced,
                        producerReward: listProducer[i].block_reward,
                    })
                    return;
                }
            }
        })
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
            if(info.gas_info.pledged_info[i].pledger === info.address)
            amount += parseFloat(info.gas_info.pledged_info[i].amount)
        }

        return Utils.formatCurrency(amount, 0)
    }

    getPledgedOthers () {
        const { info } = this.state
        if (!info || info.gas_info.pledged_info.length === 0) return 0;

        let amount = 0

        for (let i = 0; i < info.gas_info.pledged_info.length; i++) {
            if(info.gas_info.pledged_info[i].pledger !== info.address)
            amount += parseFloat(info.gas_info.pledged_info[i].amount)
        }

        return Utils.formatCurrency(amount, 0)
    }

    render() {

        const { info, isLoading, producerRank, producerVote, producerBlock, producerReward } = this.state

        return (
            <LoadingOverlay
                active={isLoading}
                spinner={<img src={LoadingIcon} />}
                className="loading-overlay"
            >

                {
                    info &&
                    <section id="address">
                        <div className="container">
                            <h3 className="address-title">Address <span>{info.address}</span></h3>
                            <button className="btn btn-default btn-copy">COPY</button>

                            {info.producer_info.length > 0 && <div className="card producer-info">
                                <div className="row">
                                    <div className="col-md-7">
                                        <div className="avatar">
                                            <img src="https://eosx-apigw.eosx.io/logo-proxy/producer/https%3A%2F%2Fimg.bafang.com%2Fcdn%2Fassets%2Fimgs%2FMjAxOTg%2FC3B8310FFC1B46DA82C8ED7910C2AD61.png"></img>
                                        </div>
                                        <div className="info">
                                            <ul className="list-inline">
                                                <li>Name</li>
                                                <li className="text-truncate">{info.producer_info[0].name ? info.producer_info[0].name : info.producer_info[0].pubkey}</li>
                                            </ul>
                                            <ul className="list-inline">
                                                <li>Location</li>
                                                <li><FlagIcon code={info.producer_info[0].loc.toLowerCase()}></FlagIcon> {Utils.countryCodeToContryName(info.producer_info[0].loc)}</li>
                                            </ul>
                                            <ul className="list-inline">
                                                <li>URL</li>
                                                <li className="text-truncate"><a href={info.producer_info[0].url} target="_blank">{info.producer_info[0].url}</a></li>
                                            </ul>
                                            <ul className="list-inline">
                                                <li>Pubkey</li>
                                                <li className="text-truncate">{info.producer_info[0].pubkey}</li>
                                            </ul>
                                            <ul className="list-inline">
                                                <li>Net ID</li>
                                                <li className="text-truncate">{info.producer_info[0].netId}</li>
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
                                            <li className="balance">{Utils.formatCurrency(info.balance, 8)} EM</li>
                                        </ul>
                                        <ul className="list-inline">
                                            <li>On Stake</li>
                                            <li>1000 EM <a className="link-to-wallet" href="/wallet/stake">Stake ></a></li>
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

                                            <p className="link-to-wallet"><a href="/wallet/gas">Pledge Gas</a> or <a href="/wallet/gas">Unpledge Gas</a></p>
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
                                            <p className="link-to-wallet"><a href="/wallet/ram">Buy Ram</a> or <a href="/wallet/ram">Sell Ram</a></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                }

            </LoadingOverlay>
        )
    }
}

export default Address