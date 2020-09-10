const path = require('path')

const appDir = path.dirname(require.main.filename)
const fileStoreOptions = {
  path: path.join(appDir, 'src', 'sessions'),
}

const sessionOptions = {
  secret: process.env.session,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
  },
}

module.exports = {
  fileStoreOptions,
  sessionOptions,
}
