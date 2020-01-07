import {createReducer,createAction} from 'redux-starter-kit';

export const setNewBlock = createAction('setBlock');
export const setAddressInfo = createAction('setAddressInfo')
export const setUnstakeAmount = createAction('setUnstakeAmount')

export const appReducer = createReducer({
    newBlock: null,
    addressInfo: null,
    unstakeAmount: 0
}, {
    [setNewBlock]: (state, {payload}) => {
        state.block = payload;
    },
    [setAddressInfo]: (state, {payload}) => {
        state.addressInfo = payload;
    },
    [setUnstakeAmount]: (state, {payload}) => {
        state.unstakeAmount = payload;
    }
});