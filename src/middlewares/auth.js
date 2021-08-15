module.exports = (service) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if (token) {
      const uid = service.verifyToken(token)
      if (uid !== null) {
        req.uid = uid
        return next()
      }
    }
    res.status(401).send('Unauthorized')
  }
}