const { getMockReq, getMockRes } = require('@jest-mock/express')
const AuthMiddleware = require('./auth')

const service = {
  verifyToken: jest.fn()
}

const authMiddleware = AuthMiddleware(service)

describe('Authentication middleware', () => {
  describe('given a request with no token', () => {
    it('should return 401', async () => {
      service.verifyToken.mockReturnValue(1)
      const req = getMockReq()
      const { res, next } = getMockRes()
      authMiddleware(req, res, next)
      expect(next).not.toBeCalled()
      expect(res.status).toBeCalledWith(401)
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
      expect(next).toBeCalled()
    })

    it('should return 401 if token is not valid', async () => {
      service.verifyToken.mockReturnValue(null)
      const { res, next } = getMockRes()
      authMiddleware(req, res, next)
      expect(next).not.toBeCalled()
      expect(res.status).toBeCalledWith(401)
    })
  })
})

