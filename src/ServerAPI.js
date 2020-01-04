import Axios from "axios";
import { API_ENDPOINT } from './constants/index'

const ServerAPI = {
    getLatestBlock() {
        return new Promise ( (resolve,reject) => {
            Axios.get(`${API_ENDPOINT}/getBlocks?page=1&pageSize=7&orderBy=number&orderType=-1`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },
    getListProducers() {
        return new Promise ( (resolve,reject) => {
            Axios.get(`${API_ENDPOINT}/getProducers?page=1&pageSize=100000&orderBy=votes&orderType=1`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },
    getLatestTransaction() {
        return new Promise ( (resolve,reject) => {
            Axios.get(`${API_ENDPOINT}/getTransactions/true?page=1&pageSize=7&orderBy=blockNumber&orderType=-1`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },
    getTopHolders() {
        return new Promise ( (resolve,reject) => {
            Axios.get(`${API_ENDPOINT}/getAddresses?page=1&pageSize=7&orderBy=balance&orderType=-1`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },
    getCountTransaction() {
        return new Promise ( (resolve,reject) => {
            Axios.get(`${API_ENDPOINT}/getCountTransaction`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },
    getTokenInfo(symbol) {
        return new Promise ( (resolve,reject) => {
            Axios.get(`${API_ENDPOINT}/getToken/${symbol}`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },
    getAddress(address) {
        return new Promise ( (resolve,reject) => {
            Axios.get(`${API_ENDPOINT}/getAddress/${address}`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },
    getTransaction(txhash) {
        return new Promise ( (resolve,reject) => {
            Axios.get(`${API_ENDPOINT}/getTransaction/${txhash}`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    }
}

export default ServerAPI;
