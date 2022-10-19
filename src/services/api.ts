import axios from 'axios'

const createReq = axios.create({
  baseURL: 'https://api.covid19api.com',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
})

export default {
  getSummary() {
    return createReq.get('/summary')
  }
}