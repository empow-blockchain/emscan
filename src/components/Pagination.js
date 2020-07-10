import React, { Fragment } from 'react';

const Pagination = props => {

    const {
        page,
        pageSize,
        count,
        onChangePage
    } = props;

    if(count < pageSize) return null;

    const totalPage = Math.ceil(count / pageSize) !== 0 ? Math.ceil(count / pageSize) : 1
    const isFirst = page === 1 ? true : false
    const isLast = page === totalPage ? true : false
    const canNext = page < totalPage
    const canPrev = page > 1

    const onFirst = () => {
        if(isFirst) return;
        onChangePage(1)
    }

    const onLast = () => {
        if(isLast) return;
        onChangePage(totalPage)
    }

    const onNext = () => {
        if(!canNext) return;
        onChangePage(page+1)
    }

    const onPrev = () => {
        if(!canPrev) return;
        onChangePage(page-1)
    }

    return (
        <Fragment>
            <ul className="pagination list-inline">
                <li className={`first ${isFirst ? "block" : ""}`} onClick={onFirst}>First</li>
                <li className="page">
                    <span className={`prev ${!canPrev ? "block" : ""}`} onClick={onPrev}>&lt;</span>
                    <span className="page-of">{page} of {totalPage}</span>
                    <span className={`next ${!canNext ? "block" : ""}`} onClick={onNext}>&gt;</span>
                </li>
                <li className={`last ${isLast ? "block" : ""}`} onClick={onLast}>Last</li>
            </ul>
            <div style={{ clear: "both" }}></div>
        </Fragment>
    );
};

export default Pagination;