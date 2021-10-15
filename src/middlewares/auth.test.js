const { getMockReq, getMockRes } = require('@jest-mock/express')
const AuthMiddleware = require('./auth')
const ApiError = require("../errors/api-error")

const service = {
  verifyToken: jest.fn()
}

const authMiddleware = AuthMiddleware(service, ApiError)

describe('Authentication middleware', () => {
  describe('given a request with no token', () => {
    it('should return 401', async () => {
      service.verifyToken.mockReturnValue(1)
      const req = getMockReq()
      const { res, next } = getMockRes()
      authMiddleware(req, res, next)
      expect(next).toBeCalledTimes(1)
      expect(next).toHaveBeenCalledWith(ApiError.unauthorized({error: "Unauthorized"}))
    })
  })

  describe('given a request with a token', () => {
    let req
    beforeEach(() => {
      req = getMockReq({
        headers: {
          authorization: 'Bearer some_token'
        }
      })
    })

    it('should call next if token is valid', async () => {
      service.verifyToken.mockReturnValue(1)
      const { res, next } = getMockRes()
      authMiddleware(req, res, next)
      expect(next).toBeCalledTimes(1)
      expect(next).not.toBeCalledWith(ApiError.unauthorized({error: "Unauthorized"}))
    })

    it('should return 401 if token is not valid', async () => {
      service.verifyToken.mockReturnValue(null)
      const { res, next } = getMockRes()
      authMiddleware(req, res, next)
      expect(next).toBeCalledTimes(1)
      expect(next).toBeCalledWith(ApiError.unauthorized({error: "Unauthorized"}))
    })
  })
})

