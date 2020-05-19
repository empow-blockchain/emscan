import React, { Component } from 'react'
import LoadingIcon from '../assets/images/loading.gif'
import Pagination from '../components/Pagination'
import ServerAPI from '../ServerAPI'
import Utils from '../utils/index'
import LoadingOverlay from 'react-loading-overlay';

class Holders extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            holders: [],
            page: 1,
            pageSize: 20,
            count: 0
        };
    };

    async componentDidMount() {

        const { page, pageSize } = this.state

        ServerAPI.getTopHolders(page, pageSize).then(holders => {
            this.setState({ holders, isLoading: false })
        })

        ServerAPI.getCountAddress().then(count => {
            this.setState({ count })
        })
    }

    onChangePage(page) {
        this.setState({ isLoading: true, page })
        ServerAPI.getTopHolders(page, this.state.pageSize).then(holders => {
            this.setState({ isLoading: false, holders })
        })
    }

    render() {

        const { holders, isLoading, page, pageSize, count } = this.state

        return (
            <LoadingOverlay
                active={isLoading}
                spinner={<img src={LoadingIcon} alt="LoadingIcon" />}
                className="loading-overlay"
            >
                <section id="txs">
                    <div className="container">
                        {holders.length > 0 &&
                            <div className="table table-transaction">
                                <div className="table-header">
                                    <p className="title">Top Holders</p>
                                    <Pagination page={page} pageSize={pageSize} count={count} onChangePage={(page) => this.onChangePage(page)}></Pagination>
                                </div>
                                <div className="table-title">
                                    <ul className="list-inline">
                                        <li style={{width: '45%'}}>Address</li>
                                        <li style={{width: '15%'}}>EM</li>
                                    </ul>
                                </div>
                                <ul className="list-inline table-body">

                                    {
                                        holders.map((value, index) => {

                                            return (
                                                <li key={index} className="table-row one-transaction">
                                                    <ul className="list-inline">
                                                        <li style={{width: '45%'}}>
                                                            <a target="_blank" rel="noopener noreferrer" href={`/address/${value.address}`}>{value.address}</a>
                                                        </li>
                                                        <li style={{width: '15%'}}>{Utils.formatCurrency(value.balance, 2)} EM</li>
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

export default Holders