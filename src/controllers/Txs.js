import React, { Component } from 'react'
import LoadingIcon from '../assets/images/loading.gif'
import ActionTag from '../components/ActionTag'
import Pagination from '../components/Pagination'
import ServerAPI from '../ServerAPI'
import Utils from '../utils/index'
import moment from 'moment'
import LoadingOverlay from 'react-loading-overlay';

class Txs extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            transactions: [],
            page: 1,
            pageSize: 20,
            count: 0
        };
    };

    async componentDidMount() {

        const { page, pageSize } = this.state

        ServerAPI.getTransactions(page, pageSize).then(transactions => {
            this.setState({ transactions, isLoading: false })
        })

        ServerAPI.getCountTransaction().then(count => {
            this.setState({ count })
        })
    }

    onChangePage(page) {
        this.setState({ isLoading: true, page })
        ServerAPI.getTransactions(page, this.state.pageSize).then(transactions => {
            this.setState({ isLoading: false, transactions })
        })
    }

    render() {

        const { transactions, isLoading, page, pageSize, count } = this.state

        return (
            <LoadingOverlay
                active={isLoading}
                spinner={<img src={LoadingIcon} alt="LoadingIcon"/>}
                className="loading-overlay"
            >
                <section id="txs">
                    <div className="container">
                        {transactions.length > 0 &&
                            <div className="table table-transaction">
                                <div className="table-header">
                                    <p className="title">Txs</p>
                                    <Pagination page={page} pageSize={pageSize} count={count} onChangePage={(page) => this.onChangePage(page)}></Pagination>
                                </div>
                                <div className="table-title">
                                    <ul className="list-inline">
                                        <li>TxHash</li>
                                        <li>Block Number</li>
                                        <li>Time</li>
                                        <li>Publisher</li>
                                        <li>Action</li>
                                        <li>Gas Used</li>
                                        <li>Status</li>
                                    </ul>
                                </div>
                                <ul className="list-inline table-body">

                                    {
                                        transactions.map((value, index) => {

                                            return (
                                                <li key={index} className="table-row one-transaction">
                                                    <ul className="list-inline">
                                                        <li>
                                                            <a className="text-truncate" target="_blank" rel="noopener noreferrer" href={`/tx/${value.hash}`}>{value.hash}</a>
                                                        </li>
                                                        <li>
                                                            <a href={`/block/${value.blockNumber}`}>{value.blockNumber}</a>
                                                        </li>
                                                        <li className="time" style={{ fontSize: 16 }}>{moment(value.time / 10 ** 6).fromNow()}</li>
                                                        <li>
                                                            <a target="_blank" rel="noopener noreferrer" href={`/address/${value.publisher}`}>{value.publisher}</a>
                                                        </li>
                                                        <li><ActionTag {...value.actions[0]}></ActionTag></li>
                                                        <li>{value.tx_receipt.gas_usage}</li>
                                                        <li>
                                                            <div className="status">
                                                                {value.tx_receipt.status_code !== "SUCCESS" && <div className="status-error">{value.tx_receipt.status_code}</div>}
                                                                {value.tx_receipt.status_code === "SUCCESS" && <div className="status-success">{Utils.properCase(value.tx_receipt.status_code)}</div>}
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
                        }
                    </div>
                </section>
            </LoadingOverlay>
        )
    }
}

export default Txs