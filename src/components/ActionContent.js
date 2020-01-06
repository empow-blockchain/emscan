import React, { Fragment } from 'react';
import Utils from '../utils/index'

const ActionContent = props => {

    const {
        contract,
        action_name,
        data,
        fromPage,
        address
    } = props;

    return (
        <div className={`action-content`}>{Utils.convertActionContent(contract,action_name,data,fromPage,address)}</div>
    );
};

export default ActionContent;