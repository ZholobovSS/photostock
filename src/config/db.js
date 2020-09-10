require('dotenv').config()
const mongoose = require('mongoose')

const options = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
  autoIndex: true,
  poolSize: 10,
  bufferMaxEntries: 0,
}

const {
  DB_HOST,
  DB_NAME,
  DB_PORT,
} = process.env

const dbConnectionURL = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`

function dbConnect() {
  mongoose.connect(dbConnectionURL, options, (err) => {
    if (err) return console.log(err)
    return console.log('Success connected to mogno')
  })
}

module.exports = dbConnect
