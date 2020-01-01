import React from 'react';

const ActionTag = props => {

    const {
        contract,
        action_name,
        data,
        fromPage
    } = props;

    let colorClass = "default"
    let content = contract + "::" + action_name

    if (contract === "token.empow") {
        colorClass = "transfer"

        switch (action_name) {
            case "transfer":
                content = "Transfer Token"
                break
            case "issue":
                content = "Issue Token"
                break
            case "transferFreeze":
                content = "Transfer Freeze"
                break
            case "create":
                content = "Create Token"
                break
            default:
                break
        }
    }

    if (contract === "ram.empow" || contract === "gas.empow") {
        colorClass = "resource"

        switch (action_name) {
            case "pledge":
                content = "Pledge Gas"
                break
            case "unpledge":
                content = "Unpledge Gas"
                break
            case "buy":
                content = "Buy Ram"
                break
            case "sell":
                content = "Sell Ram"
                break
            default:
                break
        }
    }

    if (contract === "stake.empow") {
        colorClass = "stake"

        switch (action_name) {
            case "stake":
                content = "New Stake"
                break
            case "withdraw":
                content = "Withdraw Stake"
                break
            case "unstake":
                content = "Unstake"
                break
            case "withdrawAll":
                content = "Withdraw All"
                break
            default:
                break
        }
    }

    if(contract === "social.empow") {
        colorClass = "social"

        switch (action_name) {
            case "follow":
                content = "Social Follow"
                break
            case "unfollow":
                content = "Social Unfollow"
                break
            case "post":
                content = "Social New Post"
                break
            case "like":
                content = "Social Like"
                break
            case "comment":
                content = "Social Comment"
                break
            case "report":
                content = "Social Report"
                break
            case "share":
                content = "Social Share"
                break    
            default:
                break
        }
    }

    if (contract === "vote_producer.empow") {
        colorClass = "producer"

        switch (action_name) {
            case "applyRegister":
                content = "Producer Register"
                break
            case "applyUnregister":
                content = "Producer Unregister"
                break
            case "approveRegister":
                content = "Producer Approved"
                break
            case "updateProducer":
                content = "Producer Update"
                break
            case "logInProducer":
                content = "Producer Login"
                break
            case "logOutProducer":
                content = "Producer Logout"
                break
            case "vote":
                content = "Vote"
                break
            case "unvote":
                content = "Unvote"
                break
            default:
                break
        }
    }

    if(fromPage === "address" && contract === "token.empow" && action_name === "transfer") {
        const json = JSON.parse(data)
    }

    return (
        <div className={`action-tag action-${colorClass}`}>{content}</div>
    );
};

export default ActionTag;