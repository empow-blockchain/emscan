import Axios from "axios";
import { BLOCKCHAIN_ENDPOINT } from './constants/index'

const BlockchainAPI = {

    getContractStorage(id, key, field = '') {
        return new Promise ( (resolve,reject) => {
            Axios.post(`${BLOCKCHAIN_ENDPOINT}/getContractStorage`, JSON.stringify({
                id,
                key,
                field
            }))
            .then(res => (resolve(JSON.parse(res.data.data))))
            .catch(error => (reject(error.response.data)))
        })
    },

    getTotalVote() {
        return this.getContractStorage("vote_producer.empow", "candAllKey")
    },

    getRamInfo () {
        return new Promise ( (resolve,reject) => {
            Axios.get(`${BLOCKCHAIN_ENDPOINT}/getRAMInfo`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },

    getAddress(address) {
        return new Promise ( (resolve,reject) => {
            Axios.get(`${BLOCKCHAIN_ENDPOINT}/getAccount/${address}/true`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    }
}

export default BlockchainAPI;