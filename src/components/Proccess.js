import React from 'react';

const Process = props => {

    const {
        current,
        limit
    } = props;

    let percent = Math.floor(current / limit * 100)

    return (
        <div className="process">
            <div className="current" style={{width: `${percent}%`}}></div>
        </div>
    );
};

export default Process;