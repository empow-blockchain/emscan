import Axios from "axios";
import { API_ENDPOINT } from './constants/index'

const ServerAPI = {
    getLatestBlock(address) {
        return new Promise ( (resolve,reject) => {
            Axios.get(`${API_ENDPOINT}/getBlock?page=1&pageSize=7`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },
}

export default ServerAPI;
