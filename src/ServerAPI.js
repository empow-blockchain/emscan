import Axios from "axios";
import { API_ENDPOINT } from './constants/index'

const ServerAPI = {
    getBlocks(page = 1, pageSize = 7, orderBy = "number", orderType = -1) {
        return new Promise ( (resolve,reject) => {
            Axios.get(`${API_ENDPOINT}/getBlocks?page=${page}&pageSize=${pageSize}&orderBy=${orderBy}&orderType=${orderType}`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },
    getBlock(number, getTransaction = false) {
        return new Promise ( (resolve,reject) => {
            Axios.get(`${API_ENDPOINT}/getBlock/${number}${getTransaction ? "?getTransaction=true" : ""}`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },
    getListProducers() {
        return new Promise ( (resolve,reject) => {
            Axios.get(`${API_ENDPOINT}/getProducers?page=1&pageSize=100000&orderBy=votes&orderType=-1`)
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
    getAddressTransaction(address) {
        return new Promise ( (resolve,reject) => {
            Axios.get(`${API_ENDPOINT}/getAddressTransaction/${address}?orderBy=time&orderType=-1`)
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
    },
    getStake(address) {
        return new Promise ( (resolve,reject) => {
            Axios.get(`${API_ENDPOINT}/getStake/${address}?page=1&pageSize=1000000&orderBy=packageId&orderType=-1`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    }
}

export default ServerAPI;
