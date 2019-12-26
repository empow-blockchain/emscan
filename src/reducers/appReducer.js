import {createReducer,createAction} from 'redux-starter-kit';

export const setNewBlock = createAction('setBlock');

export const appReducer = createReducer({
    newBlock: null
}, {
    [setNewBlock]: (state, {payload}) => {
        state.block = payload;
    }
});