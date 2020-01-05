import {appReducer} from './appReducer'
import {reducer as toastrReducer} from 'react-redux-toastr'

export default {
    app: appReducer,
    toastr: toastrReducer
};