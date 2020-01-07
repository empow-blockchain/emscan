import React, { Component } from 'react'
import ReactJson from 'react-json-view'

import LoadingIcon from '../assets/images/loading.gif'

import FlagIcon from '../components/FlagIcon'
import ActionTag from '../components/ActionTag'
import ActionContent from '../components/ActionContent'

import ServerAPI from '../ServerAPI'
import Utils from '../utils/index'
import moment from 'moment'
import LoadingOverlay from 'react-loading-overlay';

class BlockDetail extends Component {

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
            ramInfo: null
        };
    };

    async componentDidMount() {
        if (!this.props.match || !this.props.match.params || !this.props.match.params.number) {
            return window.location = "/"
        }

        const number = this.props.match.params.number

        ServerAPI.getBlock(number, true).then(info => {
            this.setState({ info, isLoading: false })
        }).catch(() => {
            this.setState({ notFound: true, isLoading: false })
        })
    }

    render() {

        const { info, isLoading } = this.state

        if (info)
            var witnessInfo = info.witness_info

        return (
            <LoadingOverlay
                active={isLoading}
                spinner={<img src={LoadingIcon} alt="LoadingIcon"/>}
                className="loading-overlay"
            >
                {
                    info &&
                    <section id="block-info">
                        <div className="container">
                            <h3 className="block-title">Block <span>{info.number}</span></h3>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="card basic-info">
                                        <ul className="list-inline">
                                            <li>Block Number</li>
                                            <li>{info.number}</li>
                                        </ul>
                                        <ul className="list-inline">
                                            <li>Time</li>
                                            <li>{moment(info.time / 10 ** 6).fromNow()}</li>
                                        </ul>
                                        <ul className="list-inline">
                                            <li>Producer</li>
                                            <li><a href={`/address/${witnessInfo.address}`}>{witnessInfo.name ? witnessInfo.name : witnessInfo.pubkey}</a></li>
                                        </ul>
                                        <ul className="list-inline">
                                            <li>Location</li>
                                            <li>
                                                <div className="location">
                                                    <FlagIcon code={witnessInfo.loc.toLowerCase()}></FlagIcon>
                                                    <p>{Utils.countryCodeToContryName(witnessInfo.loc)}</p>
                                                </div>
                                            </li>
                                        </ul>
                                        <ul className="list-inline">
                                            <li>Status</li>
                                            <li>
                                                {info.status === "PENDING" && <span className="badge badge-warning">{info.status}</span>}
                                                {info.status === "IRREVERSIBLE" && <span className="badge badge-success">{info.status}</span>}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card basic-info">
                                        <ul className="list-inline">
                                            <li>Gas Used</li>
                                            <li>{info.gas_usage}</li>
                                        </ul>
                                        <ul className="list-inline">
                                            <li>Txs</li>
                                            <li>{info.tx_count - 1}</li>
                                        </ul>
                                        <ul className="list-inline">
                                            <li>Reward</li>
                                            <li><b>{info.blockReward} EM</b></li>
                                        </ul>
                                        <ul className="list-inline">
                                            <li>Parent Hash</li>
                                            <li>{info.parent_hash}</li>
                                        </ul>
                                        <ul className="list-inline">
                                            <li>Hash</li>
                                            <li>{info.hash}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            {
                                info.transactions.length > 0 &&
                                <div className="table table-block-transaction">
                                    <div className="table-header">
                                        <p className="title">Transactions</p>
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
                                            info.transactions.map((value, index) => {

                                                return (
                                                    <li key={index} className="table-row one-transaction">
                                                        <ul className="list-inline">
                                                            <li>
                                                                <a className="text-truncate" style={{ width: "90%" }} href={`/tx/${value.hash}`}>{value.hash}</a>
                                                            </li>
                                                            <li className="time" style={{ fontSize: 16 }}>{moment(value.time / 10 ** 6).fromNow()}</li>
                                                            <li><ActionTag {...value.actions[0]} fromPage="address" address={info.address}></ActionTag></li>
                                                            <li>
                                                                <ActionContent {...value.actions[0]} tx_receipt={value.tx_receipt} ></ActionContent>
                                                                {Utils.convertActionContent(value.actions[0].contract, value.actions[0].action_name, value.actions[0].data, value.tx_receipt) === "" && <ReactJson collapsed={true} displayDataTypes={false} name={false} src={JSON.parse(value.actions[0].data)}></ReactJson>}
                                                            </li>
                                                        </ul>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            }
                        </div>
                    </section>
                }


            </LoadingOverlay>
        )
    }
}

export default BlockDetail