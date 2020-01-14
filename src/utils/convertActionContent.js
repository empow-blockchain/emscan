import React, { Fragment } from 'react';
import { EMPO_URL } from '../constants/index'
import Utils from '../utils/index'
import FlagIcon from '../components/FlagIcon'
import {Link} from 'react-router-dom'

export default function (contract, action_name, data, tx_receipt, fromPage = "home", address = "") {

    let content = ""

    if(tx_receipt.status_code !== "SUCCESS") {
        return <p className="error-message"><span className="title">{tx_receipt.status_code}</span> {Utils.getTransactionErrorMessage(tx_receipt.message)}</p>
    }

    if (contract === "social.empow") {
        if (action_name === "like") {
            content = <p>{fromPage !== "address" && <Fragment><span className="grey">Address</span> <a className="address " target="_blank" rel="noopener noreferrer" href={`/address/${data[0]}`}>{data[0]}</a></Fragment>}<span className="grey">Like post</span> <a href={`${EMPO_URL}/post-detail/${data[1]}`} target="_blank" rel="noopener noreferrer">{data[1]}</a></p>
        }

        if (action_name === "share") {
            content = <p>{fromPage !== "address" && <Fragment><span className="grey">Address</span> <a className="address " target="_blank" rel="noopener noreferrer" href={`/address/${data[0]}`}>{data[0]}</a></Fragment>}<span className="grey">Share post</span> <a href={`${EMPO_URL}/post-detail/${data[1]}`} target="_blank" rel="noopener noreferrer">{data[1]}</a></p>
        }

        if (action_name === "comment") {
            content = <p>{fromPage !== "address" && <Fragment><span className="grey">Address</span> <a className="address " target="_blank" rel="noopener noreferrer" href={`/address/${data[0]}`}>{data[0]}</a></Fragment>}<span className="grey">Comment</span> {data[4]}<span className="grey">in post</span> <a href={`${EMPO_URL}/post-detail/${data[1]}`} target="_blank" rel="noopener noreferrer">{data[1]}</a></p>
        }

        if (action_name === "follow") {
            content = <p>{fromPage !== "address" && <Fragment><span className="grey">Address</span> <a className="address " target="_blank" rel="noopener noreferrer" href={`/address/${data[0]}`}>{data[0]}</a></Fragment>}<span className="grey">Follow</span> <a href={`${EMPO_URL}/account/${data[1]}`} target="_blank" rel="noopener noreferrer">{data[1]}</a></p>
        }

        if (action_name === "unfollow") {
            content = <p>{fromPage !== "address" && <Fragment><span className="grey">Address</span> <a className="address " target="_blank" rel="noopener noreferrer" href={`/address/${data[0]}`}>{data[0]}</a></Fragment>}<span className="grey">Unfollow</span> <a href={`${EMPO_URL}/account/${data[1]}`} target="_blank" rel="noopener noreferrer">{data[1]}</a></p>
        }

        if (action_name === "post") {
            content = <p>{fromPage !== "address" && <Fragment><span className="grey">Address</span> <a className="address " target="_blank" rel="noopener noreferrer" href={`/address/${data[0]}`}>{data[0]}</a></Fragment>}<span className="grey">New Post</span> <a href={`${EMPO_URL}/post-detail/${tx_receipt.receipts[0].content[0]}`} target="_blank" rel="noopener noreferrer">{tx_receipt.receipts[0].content[0]}</a></p>
        }

        if(action_name === "blockContent") {
            content = <p>{fromPage !== "address" && <Fragment><span className="grey">Address</span> <a className="address " target="_blank" rel="noopener noreferrer" href={`/address/${data[0]}`}>{data[0]}</a></Fragment>}<span className="grey">Blocked</span> {data[1]}</p>
        }

        if(action_name === "unblockContent") {
            content = <p>{fromPage !== "address" && <Fragment><span className="grey">Address</span> <a className="address " target="_blank" rel="noopener noreferrer" href={`/address/${data[0]}`}>{data[0]}</a></Fragment>}<span className="grey">Blocked</span> {data[1]}</p>
        }

        if(action_name === "updateProfile") {
            content = <p><a className="address " href={`${EMPO_URL}/account/${data[0]}`}>View Profile ></a></p>
        }
    }

    if (contract === "auth.empow") {
        if (action_name === "addPremiumUsername") {
            content = <p>{fromPage !== "address" && <Fragment><span className="grey">Address</span> <a className="address " target="_blank" rel="noopener noreferrer" href={`/address/${data[0]}`}>{data[0]}</a></Fragment>}<span className="grey">Bought</span> <b>{data[1]}</b></p>
        }

        if (action_name === "addNormalUsername") {
            content = <p>{fromPage !== "address" && <Fragment><span className="grey">Address</span> <a className="address " target="_blank" rel="noopener noreferrer" href={`/address/${data[0]}`}>{data[0]}</a></Fragment>}<span className="grey">Bought</span> <b>{"newbie." + data[1]}</b></p>
        }

        if (action_name === "selectUsername") {
            content = <p><span className="grey">Selected</span> <b>{data[0]}</b></p>
        }
    }

    if (contract === "token.empow") {
        if (action_name === "transfer") {
            content = (
                <p>
                    <span className="grey"></span> <b>{(fromPage === "address" && address === data[2] && "+") || (fromPage === "address" && address === data[1] && "-")}{Utils.formatCurrency(data[3], 8)} {data[0].toUpperCase()}</b>
                    {((fromPage === "address" && address === data[2]) || fromPage !== "address") && <Fragment><span className="grey">From</span> <a className="address " target="_blank" rel="noopener noreferrer" href={`/address/${data[1]}`}>{data[1]}</a></Fragment>}
                    {((fromPage === "address" && address === data[1]) || fromPage !== "address") && <Fragment><span className="grey">To</span> <a className="address " target="_blank" rel="noopener noreferrer" href={`/address/${data[2]}`}>{data[2]}</a></Fragment>}
                    {data[4] !== "" && <span className="grey">Memo</span>} {data[4]}
                </p>
            )
        }
    }

    if (contract === "gas.empow") {
        if (action_name === "pledge") {
            content = <p>{fromPage !== "address" && <Fragment><span className="grey">Address</span> <a className="address " target="_blank" rel="noopener noreferrer" href={`/address/${data[0]}`}>{data[0]}</a></Fragment>}{data[0] !== data[1] && <Fragment><span className="grey">Pledge For</span> <a className="address " target="_blank" rel="noopener noreferrer" href={`/address/${data[1]}`}>{data[1]}</a></Fragment>}<span className="grey">Amount EM</span> <b>-{Utils.formatCurrency(data[2], 8)} EM</b><span className="grey">Amount Gas</span> <b>+{Utils.formatCurrency(data[2] * 10000)} GAS</b></p>
        }

        if (action_name === "unpledge") {
            content = <p>{fromPage !== "address" && <Fragment><span className="grey">Address</span> <a className="address " target="_blank" rel="noopener noreferrer" href={`/address/${data[0]}`}>{data[0]}</a></Fragment>}{data[0] !== data[1] && <Fragment><span className="grey">Unpledge of</span> <a className="address " target="_blank" rel="noopener noreferrer" href={`/address/${data[1]}`}>{data[1]}</a></Fragment>}<span className="grey">Amount</span> <b>+{Utils.formatCurrency(data[2], 8)} EM</b></p>
        }
    }

    if (contract === "ram.empow") {
        if (action_name === "buy") {
            content = <p>{fromPage !== "address" && <Fragment><span className="grey">Address</span> <a className="address " target="_blank" rel="noopener noreferrer" href={`/address/${data[0]}`}>{data[0]}</a></Fragment>}{data[0] !== data[1] && <Fragment><span className="grey">Buy For</span> <a className="address " href={`/address/${data[1]}`} target="_blank" rel="noopener noreferrer">{data[1]}</a></Fragment>}<span className="grey">Amount</span> <b>+{Utils.formatCurrency(data[2])} Bytes</b></p>
        }

        if (action_name === "sell") {
            content = <p>{fromPage !== "address" && <Fragment><span className="grey">Address</span> <a className="address " target="_blank" rel="noopener noreferrer" href={`/address/${data[0]}`}>{data[0]}</a></Fragment>}{data[0] !== data[1] && <Fragment><span className="grey">Sell of</span> <a className="address " href={`/address/${data[1]}`} target="_blank" rel="noopener noreferrer">{data[1]}</a></Fragment>}<span className="grey">Amount</span> <b>-{Utils.formatCurrency(data[2])} Bytes</b></p>
        }
    }

    if (contract === "vote_producer.empow") {
        if (action_name === "applyRegister") {
            content = <p>{fromPage !== "address" && <Fragment><span className="grey">Address</span> <a className="address " target="_blank" rel="noopener noreferrer" href={`/address/${data[0]}`}>{data[0]}</a></Fragment>}<span className="grey">Pubkey</span> {data[1]}<br /><span className="grey" style={{ marginLeft: 0 }}>Location</span> <FlagIcon code={data[2].toLowerCase()}></FlagIcon> {Utils.countryCodeToContryName(data[2])}<br /><span className="grey" style={{ marginLeft: 0 }}>URL</span> <a href={data[3]} target="_blank" rel="noopener noreferrer">{data[3]}</a><br /><span className="grey" style={{ marginLeft: 0 }}>Net ID</span> {data[4]}</p>
        }

        if (action_name === "updateProducer") {
            content = <p>{fromPage !== "address" && <Fragment><span className="grey">Address</span> <a className="address " target="_blank" rel="noopener noreferrer" href={`/address/${data[0]}`}>{data[0]}</a></Fragment>}<span className="grey">Pubkey</span> {data[1]}<br /><span className="grey" style={{ marginLeft: 0 }}>Location</span> <FlagIcon code={data[2].toLowerCase()}></FlagIcon> {Utils.countryCodeToContryName(data[2])}<br /><span className="grey" style={{ marginLeft: 0 }}>URL</span> <a href={data[3]} target="_blank" rel="noopener noreferrer">{data[3]}</a><br /><span className="grey" style={{ marginLeft: 0 }}>Net ID</span> {data[4]}</p>
        }

        if (action_name === "vote") {
            content = <p><b>-{Utils.formatCurrency(data[2])} VOTE</b> {fromPage !== "address" && <Fragment><span className="grey">From</span> <a className="address " target="_blank" rel="noopener noreferrer" href={`/address/${data[0]}`}>{data[0]}</a></Fragment>}<span className="grey">For</span> <a className="address" href={`/address/${data[1]}`} target="_blank" rel="noopener noreferrer">{data[1]}</a></p>
        }

        if (action_name === "unvote") {
            content = <p><b>+{Utils.formatCurrency(data[2])} VOTE</b> {fromPage !== "address" && <Fragment><span className="grey">For</span> <a className="address " target="_blank" rel="noopener noreferrer" href={`/address/${data[0]}`}>{data[0]}</a></Fragment>}<span className="grey">From</span> <a className="address" href={`/address/${data[1]}`} target="_blank" rel="noopener noreferrer">{data[1]}</a></p>
        }

        if (action_name === "logInProducer") {
            content = <p>{fromPage !== "address" && <Fragment><span className="grey">Address</span> <a className="address " target="_blank" rel="noopener noreferrer" href={`/address/${data[0]}`}>{data[0]}</a></Fragment>}<span className="grey">Success</span></p>
        }

        if (action_name === "candidateWithdraw") {
            content = <p>{fromPage !== "address" && <Fragment><span className="grey">Address</span> <a className="address " target="_blank" rel="noopener noreferrer" href={`/address/${data[0]}`}>{data[0]}</a></Fragment>}<span className="grey">Received</span> <b>{tx_receipt.receipts.length > 0 ? `${Utils.formatCurrency(tx_receipt.receipts[0].content[3],2)} EM` : `0 EM`}</b></p>
        }

        if (action_name === "approveRegister") {
            content = <p><span className="grey">Accept Producer</span> <a className="address " target="_blank" rel="noopener noreferrer" href={`/address/${data[0]}`}>{data[0]}</a></p>
        }
        
    }

    if (contract === "stake.empow") {
        if (action_name === "stake") {
            content = <p>{fromPage !== "address" && <Fragment><span className="grey">Address</span> <a className="address " target="_blank" rel="noopener noreferrer" href={`/address/${data[0]}`}>{data[0]}</a></Fragment>}<span className="grey">Stake</span> <b>{Utils.formatCurrency(data[1])} EM</b></p>
        }

        if (action_name === "unstake") {
            content = <p>{fromPage !== "address" && <Fragment><span className="grey">Address</span> <a className="address " target="_blank" rel="noopener noreferrer" href={`/address/${data[0]}`}>{data[0]}</a></Fragment>}<span className="grey">Unstaked ID {data[1]}</span> <Link to={`/wallet/stake`} target="_blank" rel="noopener noreferrer">View Stake ></Link></p>
        }

        if(action_name === "withdraw") {
            content = <p>{fromPage !== "address" && <Fragment><span className="grey">Address</span> <a className="address " target="_blank" rel="noopener noreferrer" href={`/address/${data[0]}`}>{data[0]}</a></Fragment>}<span className="grey">Withdraw ID {data[1]}</span> <Link to={`/wallet/stake`} target="_blank" rel="noopener noreferrer">View Stake ></Link></p>
        }
    }

    return content
}