require('dotenv').config()
const express = require('express')
const path = require('path')
const hbs = require('hbs')
const passport = require('passport')
const session = require('express-session')
const http = require('http')
const WebSocket = require('ws')
const FileStore = require('session-file-store')(session)
const indexRouter = require('./src/routes/index')
const photoRouter = require('./src/routes/photos')
const authRouter = require('./src/routes/auth')
const dbConnect = require('./src/config/db')
const passportSetup = require('./src/config/passport')

const OPTIONS = require('./src/config')

const app = express()
const PORT = process.env.PORT ?? 3000

const map = new Map()

dbConnect()

// initialize sessions
const sessionParser = session({
  ...OPTIONS.sessions.sessionOptions,
  store: new FileStore(OPTIONS.sessions.fileStoreOptions),
})
app.use(sessionParser)

// initialize passport
app.use(passport.initialize())
app.use(passport.session())

// set config for POST form
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// set config for HBS
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'src', 'views'))
hbs.registerPartials(path.join(__dirname, 'src', 'views', 'partials'))
hbs.registerHelper('ifEquals', (arg1, arg2, options) => ((arg1 === arg2) ? options.fn(this) : options.inverse(this)))

// set config for static file in express
app.use(express.static('public'))

app.use('/', indexRouter)
app.post('/', (req, res) => {
  console.log(req.body)
  res.send()
})
app.use('/auth', authRouter)
app.use('/photos', photoRouter)

const server = http.createServer(app)
const wss = new WebSocket.Server({ noServer: true })

/*
const newWs = new WebSocket.Server({ server })

newWs.on('connection', (ws) => {
  ws.on('message', (data) => {
    newWs.clients.forEach((client) => {
      client.send(data)
    })
  })
})
*/

server.on('upgrade', (request, socket, head) => {
  console.log('Parsing session from request...')

  sessionParser(request, {}, () => {
    console.log(request.session.passport.user)
    if (!request.session.passport.user) {
      socket.destroy()
      return
    }

    console.log('Session is parsed!')

    wss.handleUpgrade(request, socket, head, (client) => {
      wss.emit('connection', client, request)
    })
  })
})

wss.on('connection', (client, request) => {
  const { user: userId } = request.session.passport

  // console.log(userId)

  map.set(userId, client)

  client.on('message', async (message) => {
    const clientData = JSON.parse(message)

    // Some logic here

    for (const [key, value] of map) {
      value.send(JSON.stringify({
        userID: key,
        message: clientData,
      }))
    }
  })

  client.on('close', () => {
    console.log('connections close for: ', userId)
    map.delete(userId)
  })
})

// Start the server.
server.listen(PORT, () => {
  console.log('Server has been started on port', PORT)
})
