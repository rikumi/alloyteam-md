const axios = require('axios').default;
const axiosRetry = require('axios-retry');

axios.defaults.timeout = 5000;
axiosRetry(axios, { retries: 3, shouldResetTimeout: true });

module.exports = axios;
