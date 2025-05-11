// const clientFetch = require('client-fetch')
// const request = clientFetch.create({
//   baseURL: process.env.VUE_APP_BASE_API,
//   timeout: 5000,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// })

// request.interceptors.request.use((config) => {
//   // Do something before request is sent
//   if (config.headers['Content-Type'] === 'application/json') {
//     config.data = JSON.stringify(config.data)
//   }
//   if (config.method === 'get') {
//     config.params = config.data
//   }
//   return config
// })
// request.interceptors.response.use((response) => {
//   // Do something with response data
//   return response
// })

const request = () => {}

export default request
