import React, { Component } from 'react'

import FlagIcon from '../components/FlagIcon'
import Proccess from '../components/Proccess'
import Pagination from '../components/Pagination'

import ServerAPI from '../ServerAPI'
import BlockchainAPI from '../BlockchainAPI'
import Utils from '../utils/index'

class Producer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            listProducers: [],
            totalVote: 0,
            page: 1,
            pageSize: 20,
            count: 0,
        };
    };

    async componentDidMount() {
        ServerAPI.getListProducers().then(listProducers => {
            this.setState({ listProducers })
        })

        BlockchainAPI.getTotalVote().then(totalVote => {
            this.setState({ totalVote })
        })
    }

    render() {

        const { listProducers, totalVote, page, pageSize, count } = this.state

        return (
            <section id="producer">
                <div className="container">
                    <div className="table table-producer">
                        <div className="table-header">
                            <p className="title">Producers</p>
                            <Pagination page={page} pageSize={pageSize} count={count}></Pagination>
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
                            <Pagination page={page} pageSize={pageSize} count={count}></Pagination>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default Producer