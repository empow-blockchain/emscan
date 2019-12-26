import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer'
import FlagIcon from '../components/FlagIcon'
import ActionTag from '../components/ActionTag'
import Proccess from '../components/Proccess'

import ServerAPI from '../ServerAPI'
import Utils from '../utils/index'
import moment from 'moment'

class HomeController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            latestBlockNumber: 0,
            latestBlock: []
        };
    };

    async componentDidMount() {
        const latestBlock = await ServerAPI.getLatestBlock()
        console.log(latestBlock);
    }

    renderLatestBlock() {

        let { latestBlock, latestBlockNumber } = this.state

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
                        return (
                            <li className="table-row one-block">
                                <div className="block-number">
                                    <a className="number" href="/block/0">{value.number}</a>
                                    <p className="time">{moment(value.time / 10**6).fromNow()}</p>
                                </div>
                                <div className="witness">
                                    <div className="thumbnail">
                                        <img className="logo" alt="witness" src="https://eosx-apigw.eosx.io/logo-proxy/producer/https%3A%2F%2Fimg.bafang.com%2Fcdn%2Fassets%2Fimgs%2FMjAxOTg%2FC3B8310FFC1B46DA82C8ED7910C2AD61.png"></img>
                                        <FlagIcon className="flag" code="sg"></FlagIcon>
                                    </div>
                                    <div className="name">
                                        <p className="producer text-truncate">Witness <a href="/producer">{value.witness}</a></p>
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
        return (
            <div className="table table-transaction">
                <div className="table-header">
                    <p className="title">Latest Transactions</p>
                </div>
                <ul className="list-inline table-body">
                    <li className="table-row one-transaction">

                        <ActionTag contract="token.empow" action_name="transfer" data='["em","EM2ZsE41ZSeukSxhMyLsb3dZWP7fgFt43L7e5b9hXVBGPU7U4","EM2ZsDPZnb4mZQUsyVWSKkzJf66zzXjDgFFmAGaYaxbkquGWM","1000","new server"]' fromPage="home"></ActionTag>

                        <div className="info">
                            <a className="text-truncate" href="/address/EM2ZsE41ZSeukSxhMyLsb3dZWP7fgFt43L7e5b9hXVBGPU7U4">EM2ZsE41ZSeukSxhMyLsb3dZWP7fgFt43L7e5b9hXVBGPU7U4</a>
                            <p className="time">32 seconds ago</p>
                        </div>
                    </li>
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
        return (
            <div className="table table-holder">
                <div className="table-header">
                    <p className="title">Top Holders</p>
                </div>
                <ul className="list-inline table-body">
                    <li className="table-row one-holder">

                        <div className="info">
                            <span className="top-number">1</span>
                            <div className="address">
                                <a className="text-truncate" href="/address/EM2ZsE41ZSeukSxhMyLsb3dZWP7fgFt43L7e5b9hXVBGPU7U4">EM2ZsE41ZSeukSxhMyLsb3dZWP7fgFt43L7e5b9hXVBGPU7U4</a>
                                <p className="type time">Address</p>
                            </div>
                        </div>

                        <div className="balance">
                            <p className="balance-em">{Utils.formatCurrency(75960000, 0)} EM</p>
                            <p className="balance-usd time">$ {Utils.formatCurrency(10000, 0)}</p>
                        </div>
                    </li>
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
                    <li className="table-row one-producer">
                        <ul className="list-inline">
                            <li>
                                <div className="top-number">1</div>
                            </li>
                            <li>
                                <div className="name">
                                    <div className="thumbnail">
                                        <img className="logo" alt="witness" src="https://eosx-apigw.eosx.io/logo-proxy/producer/https%3A%2F%2Fimg.bafang.com%2Fcdn%2Fassets%2Fimgs%2FMjAxOTg%2FC3B8310FFC1B46DA82C8ED7910C2AD61.png"></img>
                                    </div>
                                    <div className="address">
                                        <a href="/address" className="text-truncate">EM2ZsE41ZSeukSxhMyLsb3dZWP7fgFt43L7e5b9hXVBGPU7U4</a>
                                        <a href="/address" className="text-truncate time">EM2ZsE41ZSeukSxhMyLsb3dZWP7fgFt43L7e5b9hXVBGPU7U4</a>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="location">
                                    <FlagIcon code="us"></FlagIcon>
                                    <p>United States</p>
                                </div>
                            </li>
                            <li>
                                <div className="vote">
                                    <p>75,960,000 <span className="time">(50.7%)</span></p>
                                    <Proccess current={50} limit={100}></Proccess>
                                </div>
                            </li>
                            <li>
                                <div className="status">
                                    <div className="status-success">Ready</div>
                                </div>
                            </li>
                            <li>
                                <div className="block">
                                    <p>75,960,000</p>
                                </div>
                            </li>
                            <li>
                                <div className="block-reward">
                                    <p>75,960,000 EM</p>
                                </div>
                            </li>
                            <li>
                                <div className="btn-vote">
                                    <a href="/wallet/vote" className="btn btn-default">Vote for Producer</a>
                                </div>
                            </li>
                        </ul>
                    </li>
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
            <Fragment>
                <Header />
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
                <Footer />
            </Fragment>
        )
    }
}

export default connect(state => ({
    block: state.app.block
}), ({
}))(HomeController)