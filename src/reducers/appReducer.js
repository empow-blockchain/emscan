import {createReducer,createAction} from 'redux-starter-kit';

export const setNewBlock = createAction('setBlock');
export const setAddressInfo = createAction('setAddressInfo')

export const appReducer = createReducer({
    newBlock: null,
    addressInfo: null,
}, {
    [setNewBlock]: (state, {payload}) => {
        state.block = payload;
    },
    [setAddressInfo]: (state, {payload}) => {
        state.addressInfo = payload;
    }
});