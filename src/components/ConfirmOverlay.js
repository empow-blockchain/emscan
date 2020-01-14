import React from 'react';

const ConfirmOverlay = props => {

    const {
        isShow,
        title,
        moreComponent,
        onCancel,
        onOk,
    } = props;

    return (
        <div className={`confirm-overlay ${isShow ? "confirm-show" : ""}`}>
            <div className="wrapper">
                {moreComponent && moreComponent}
                {title && <p>{title}</p>}
                <div className="action">
                    <span onClick={onCancel}>Cancel</span>
                    <span onClick={onOk}>OK</span>
                </div>
            </div>
        </div>
    );
};

export default ConfirmOverlay;