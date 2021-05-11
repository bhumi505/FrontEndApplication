export default {
    api: process.env.NODE_ENV == "development" ? process.env.REACT_APP_DEV_API_URL : process.env.REACT_APP_HEROKU_API_URL
}