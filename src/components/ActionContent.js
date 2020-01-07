import React from 'react';
import Utils from '../utils/index'

const ActionContent = props => {

    const {
        contract,
        action_name,
        data,
        fromPage,
        address,
        tx_receipt
    } = props;

    return (
        <div className={`action-content`}>{Utils.convertActionContent(contract,action_name,data,tx_receipt,fromPage,address)}</div>
    );
};

export default ActionContent;