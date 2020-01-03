import React from 'react';

const ActionContent = props => {

    const {
        contract,
        action_name,
        data,
    } = props;

    let content = ""
    const arr = JSON.parse(data)

    if (contract === "social.empow") {
        if (action_name === "like") {
            content = <p><span className="grey">Address</span> <a className="address text-truncate" href={`/address/${arr[0]}`}>{arr[0]}</a> like for postID : <b>{arr[1]}</b></p>
        }
    }

    if (contract === "token.empow") {
        if (action_name === "transfer") {
            content = (
                <p>
                    <span className="grey">From</span> <a className="address text-truncate" href={`/address/${arr[1]}`}>{arr[1]}</a>
                    <span className="grey">To</span> <a className="address text-truncate" href={`/address/${arr[1]}`}>{arr[2]}</a>
                    <span className="grey">Amount</span> <b>{arr[3]} {arr[0].toUpperCase()}</b>
                    <span className="grey">Memo</span> {arr[4]}
                </p>
            )
        }
    }

    return (
        <div className={`action-content`}>{content}</div>
    );
};

export default ActionContent;