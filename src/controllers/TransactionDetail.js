import React, { Component } from 'react'
import ReactJson from 'react-json-view'

import LoadingOverlay from 'react-loading-overlay';
import LoadingIcon from '../assets/images/loading.gif'
import upArrowIcon from '../assets/images/up-arrow.png'

import ActionTag from '../components/ActionTag'
import ActionContent from '../components/ActionContent'

import ServerAPI from '../ServerAPI'
import Utils from '../utils/index'
import moment from 'moment'
import ButtonCopy from '../components/ButtonCopy'

class TransactionDetail extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activeTab: "actions",
            info: null,
            notFound: false,
            isLoading: true
        };
    };

    async componentDidMount() {
        if (!this.props.match || !this.props.match.params || !this.props.match.params.hash) {
            return window.location = "/"
        }

        ServerAPI.getTransaction(this.props.match.params.hash).then(info => {
            this.setState({ info, isLoading: false })
        }).catch(() => {
            this.setState({ notFound: true, isLoading: false })
        })
    }

    render() {

        const { activeTab, info, isLoading } = this.state
        let ramUsed = 0

        // calc ram used
        if (info && info.tx_receipt.ram_usage) {
            for (const key in info.tx_receipt.ram_usage) {
                ramUsed += parseInt(info.tx_receipt.ram_usage[key])
            }
        }

        return (
            <LoadingOverlay
                active={isLoading}
                spinner={<img src={LoadingIcon} alt="LoadingIcon"/>}
                className="loading-overlay"
            >
                {info &&
                    <section id="transaction-detail">
                        <div className="container">
                            <h3 className="txhash">TxHash <span>{info.hash}</span></h3>
                            <ButtonCopy copyText={info.hash}></ButtonCopy>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="card tx-info">
                                        <ul className="list-inline">
                                            <li>Time</li>
                                            <li>{moment(info.time / 10 ** 6).fromNow()}</li>
                                        </ul>
                                        <ul className="list-inline">
                                            <li>Publisher</li>
                                            <li><a href={`/address/${info.publisher}`}>{info.publisher}</a></li>
                                        </ul>
                                        <ul className="list-inline">
                                            <li>Block Number</li>
                                            <li><a href={`/block/${info.blockNumber}`}>{info.blockNumber}</a></li>
                                        </ul>
                                        <ul className="list-inline">
                                            <li>Status</li>
                                            <li>
                                                {info.tx_receipt.status_code === "RUNTIME_ERROR" && <span className="badge badge-danger">{info.tx_receipt.status_code}</span>}
                                                {info.tx_receipt.status_code === "SUCCESS" && <span className="badge badge-success">{info.tx_receipt.status_code}</span>}
                                            </li>
                                        </ul>
                                        {info.tx_receipt.message !== "" && <ul className="list-inline">
                                            <li>Error Message</li>
                                            <li className="error-message">{Utils.getTransactionErrorMessage(info.tx_receipt.message)}</li>
                                        </ul>}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card tx-info">
                                        <ul className="list-inline">
                                            <li>Gas Used</li>
                                            <li>{Utils.formatCurrency(info.tx_receipt.gas_usage, 0)}</li>
                                        </ul>
                                        <ul className="list-inline">
                                            <li>Ram Used</li>
                                            <li>{Utils.formatCurrency(ramUsed, 0)} Bytes</li>
                                        </ul>
                                        <ul className="list-inline">
                                            <li>Actions</li>
                                            <li>{info.actions.length}</li>
                                        </ul>
                                        <ul className="list-inline">
                                            <li>Receipts</li>
                                            <li>{info.tx_receipt.receipts.length}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="actions">
                                <ul className="list-inline tabs">
                                    <li className={activeTab === "actions" ? "active" : ""} onClick={() => this.setState({ activeTab: "actions" })}>Actions <span className="badge badge-cirlce">{info.actions.length}</span></li>
                                    <li className={activeTab === "rawData" ? "active" : ""} onClick={() => this.setState({ activeTab: "rawData" })}>Raw Data</li>
                                </ul>
                                {activeTab === "actions" &&
                                    <div className="actions-content">
                                        {info.actions.map((value, index) => {
                                            return (
                                                <ul key={index} className="list-inline one-action">
                                                    <li><ActionTag {...value} /></li>
                                                    <li>
                                                        <ActionContent {...value} tx_receipt={info.tx_receipt}/>
                                                        <ReactJson style={{ background: "#f7f7f7", marginTop: 10 }} displayDataTypes={false} name={false} src={JSON.parse(value.data)}></ReactJson>
                                                    </li>
                                                </ul>
                                            )
                                        })
                                        }
                                        {info.tx_receipt.receipts.length > 1 && <p href="#" className="hide-recepeit"><img src={upArrowIcon} alt="upArrowIcon"/>Hide Receipts</p>}
                                        {info.tx_receipt.receipts.length > 1 && info.tx_receipt.receipts.map((value, index) => {
                                            const arr = value.func_name.split("/")
                                            return (
                                                <ul key={index} className="list-inline one-receipt">
                                                    <li><ActionTag contract={arr[0]} action_name={arr[1]} data={value.content}/></li>
                                                    <li className="json">{value.content}</li>
                                                </ul>
                                            )
                                        })}
                                    </div>
                                }

                                {activeTab === "rawData" &&
                                    <div className="rawData">
                                        <ReactJson style={{ padding: "10px 20px" }} displayDataTypes={false} name={false} src={info}></ReactJson>
                                    </div>
                                }
                            </div>
                        </div>
                    </section>
                }
            </LoadingOverlay>
        )
    }
}

export default TransactionDetail