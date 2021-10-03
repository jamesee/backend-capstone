module.exports = (service, ApiError) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if (token) {
      const decoded = service.verifyToken(token)
      if (decoded !== null) {
        req.uid = decoded.uid;
        req.username = decoded.username;
        return next()
      }
    }
    
    return next(ApiError.unauthorized({error: "Unauthorized"}))

  }
}