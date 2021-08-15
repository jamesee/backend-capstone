const request = require('supertest')
const utils = require('./utils')

const app = utils.app
const db = utils.db

const username = 'test_user'
const password = 'test_password'

beforeAll(async () => {
  await utils.setup()
})

afterAll(async () => {
  await utils.teardown()
})

describe('GET /', () => {
  it('should return 200', async () => {
    return request(app)
      .get('/')
      .expect(200)
  })
})

describe('POST /register', () => {
  beforeAll(async () => {
    await db.clearUsersTables()
  })

  it('should return with a token', async () => {
    return request(app)
      .post('/register')
      .send({ username, password })
      .expect(200)
      .then(response => {
        expect(response.body.token).toBeTruthy()
      })
  })

  it('should return 400 if user exists', async () => {
    return request(app)
      .post('/register')
      .send({ username, password })
      .expect(400)
      .then(response => {
        expect(response.body.token).toBeFalsy()
      })
  })
})

describe('POST /login', () => {
  beforeAll(async () => {
    await db.clearUsersTables()
    await utils.registerUser(username, password)
  })
  
  describe('valid login credentials', () => {
    it('should return with a token', async () => {
      return request(app)
        .post('/login')
        .send({ username, password })
        .expect(200)
        .then(response => {
          expect(response.body.token).toBeTruthy()
        })
    })
  })
  
  describe('invalid login credentials', () => {
    it('should return 400', async () => {
      return request(app)
        .post('/login')
        .send({ username, password: 'wrong_password' })
        .expect(400)
        .then(response => {
          expect(response.body.token).toBeFalsy()
        })
    })
  })
})