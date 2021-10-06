require('dotenv').config()
const bcrypt = require('bcrypt')
const AuthService = require('./auth')

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS)
const username = 'test_user'
const password = 'test_password'

const db = {
  findUserByUsername: jest.fn(async () => {
    return {
      id: 1,
      username: username,
      password_hash: await bcrypt.hash(password, SALT_ROUNDS)
    }
  }),
  insertUser: jest.fn(() => {
    return { id: 1 }
  })
}

const authService = AuthService(db)

describe('Register user', () => {
  describe('given a new username and password', () => {
    it('should return a token', async () => {
      db.findUserByUsername.mockResolvedValueOnce(null)
      const token = await authService.registerUser(username, password)
      expect(token).toBeTruthy()
    })
  })

  describe('given an existing username', () => {
    it('should return null', async () => {
      const token = await authService.registerUser(username, password)
      expect(token).toBeFalsy()
    })
  })
})

describe('Login user', () => {
  describe('given a valid username and password', () => {
    it('should return a token', async () => {
      const token = await authService.loginUser(username, password)
      expect(token).toBeTruthy()
    })
  })

  describe('given an invalid password', () => {
    it('should return null', async () => {
      const token = await authService.loginUser(username, 'wrong_password')
      expect(token).toBeFalsy()
    })
  })

  describe('given an invalid username', () => {
    it('should return null', async () => {
      db.findUserByUsername.mockResolvedValueOnce(null)
      const token = await authService.loginUser('wrong_username', password)
      expect(token).toBeFalsy()
    })
  })
})

describe('Verify token', () => {
  describe('given a valid token for a particular uid', () => {
    it('should return the same uid', async () => {
      const uid = 2
      const token = authService.generateToken(uid)
      const ret = await authService.verifyToken(token)
      expect(ret).toEqual(uid)
    })
  })

  describe('given an invalid token', () => {
    it('should return null', async () => {
      const token = 'gibberish'
      const ret = await authService.verifyToken(token)
      expect(ret).toBeNull()
    })
  })
})

