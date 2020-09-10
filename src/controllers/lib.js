const isAuthenticated = (req, res, next) => {
  if (req.method !== 'GET') {
    return req.isAuthenticated() ? next() : res.sendStatus(401)
  }
  return req.isAuthenticated() ? next() : res.redirect('/')
}

module.exports = {
  isAuthenticated,
}
