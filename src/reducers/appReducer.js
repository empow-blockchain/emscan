import {createReducer,createAction} from 'redux-starter-kit';

export const setLatestBlock = createAction('setLatestBlock');
export const setAddressInfo = createAction('setAddressInfo')
export const setUnstakeAmount = createAction('setUnstakeAmount')
export const setListProducer = createAction('setProducerList')

export const appReducer = createReducer({
    latestBlock: [],
    addressInfo: null,
    unstakeAmount: 0,
    listProducer: []
}, {
    [setLatestBlock]: (state, {payload}) => {
        state.latestBlock.unshift(payload)
        if(state.latestBlock.length > 7) {
            state.latestBlock.pop()
        }
    },
    [setAddressInfo]: (state, {payload}) => {
        state.addressInfo = payload;
    },
    [setUnstakeAmount]: (state, {payload}) => {
        state.unstakeAmount = payload;
    },
    [setListProducer]: (state, {payload}) => {
        state.listProducer = payload;
    }
});