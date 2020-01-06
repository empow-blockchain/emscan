import React, { Component } from 'react'

import FlagIcon from '../components/FlagIcon'
import Pagination from '../components/Pagination'

import ServerAPI from '../ServerAPI'
import Utils from '../utils/index'
import moment from 'moment'

class Block extends Component {

    constructor(props) {
        super(props);

        this.state = {
            blocks: [],
            listProducers: [],
            page: 1,
            pageSize: 20,
            count: 0
        };
    };

    async componentDidMount() {
        ServerAPI.getBlocks(this.state.page, this.state.pageSize).then(blocks => {
            this.setState({ count: blocks[0].number })
            this.setState({ blocks })
        })

        ServerAPI.getListProducers().then(listProducers => {
            this.setState({ listProducers })
        })
    }

    getProducerInfo(pubkey) {
        const { listProducers } = this.state

        if (listProducers.length === 0) return null

        for (let i = 0; i < listProducers.length; i++) {
            if (pubkey === listProducers[i].pubkey) return listProducers[i]
        }
    }

    onChangePage(page) {
        this.setState({ blocks: [], page })
        ServerAPI.getBlocks(page, this.state.pageSize).then(blocks => {
            this.setState({ blocks })
        })
    }

    render() {

        const { blocks, page, pageSize, count } = this.state

        return (
            <section id="block">
                <div className="container">
                    <div className="table table-block">
                        <div className="table-header">
                            <p className="title">BLOCKS</p>
                            <Pagination page={page} pageSize={pageSize} count={count} onChangePage={(page) => this.onChangePage(page)}></Pagination>
                        </div>
                        <div className="table-title">
                            <ul className="list-inline">
                                <li>Number</li>
                                <li>Time</li>
                                <li>Producer</li>
                                <li>Location</li>
                                <li>Txs</li>
                                <li>Gas Used</li>
                                <li>Reward</li>
                                <li>Status</li>
                            </ul>
                        </div>
                        <ul className="list-inline table-body">

                            {
                                blocks.map((value, index) => {

                                    const producerInfo = this.getProducerInfo(value.witness)

                                    let avatar = producerInfo && producerInfo.avatar ? producerInfo.avatar : "https://eosx-apigw.eosx.io/logo-proxy/producer/https%3A%2F%2Fimg.bafang.com%2Fcdn%2Fassets%2Fimgs%2FMjAxOTg%2FC3B8310FFC1B46DA82C8ED7910C2AD61.png"
                                    let name = producerInfo && producerInfo.name ? producerInfo.name : value.witness
                                    let address = producerInfo && producerInfo.address ? producerInfo.address : value.witness
                                    let loc = producerInfo && producerInfo.loc ? producerInfo.loc : "VN"

                                    return (
                                        <li key={index} className="table-row one-block">
                                            <ul className="list-inline">
                                                <li>
                                                    <a href={`/block/${value.number}`}>{value.number}</a>
                                                </li>
                                                <li className="time" style={{ fontSize: 16 }}>{moment(value.time / 10 ** 6).fromNow()}</li>
                                                <li>
                                                    <div className="name">
                                                        <div className="thumbnail">
                                                            <img className="logo" alt="witness" src={avatar}></img>
                                                        </div>
                                                        <div className="address">
                                                            <a href={`/address/${address}`} className="text-truncate">{name}</a>
                                                            <a href={`/address/${address}`} className="text-truncate time">{address}</a>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="location">
                                                        <FlagIcon code={loc.toLowerCase()}></FlagIcon>
                                                        <p>{Utils.countryCodeToContryName(loc)}</p>
                                                    </div>
                                                </li>
                                                <li>{value.tx_count}</li>
                                                <li>{value.gas_usage}</li>
                                                <li>{value.blockReward} EM</li>
                                                <li>
                                                    <div className="status">
                                                        {value.status === 0 && <div className="status-pending">Pending</div>}
                                                        {value.status === "IRREVERSIBLE" && <div className="status-success">IRREVERSIBLE</div>}
                                                        {(value.status === 2 || value.statue === 3) && <div className="status-error">Not Ready</div>}
                                                    </div>
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
                </div>
            </section>
        )
    }
}

export default Block