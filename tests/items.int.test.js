const request = require('supertest')
const utils = require('./utils')

const app = utils.app
const db = utils.db

let token

beforeAll(async () => {
  await utils.setup()
  token = await utils.registerUser()
})

afterAll(async () => {
  await utils.teardown()
})

describe('GET /items', () => {
  describe('given no items in db', () => {
    beforeAll(async () => {
      await db.clearItemsTables()
    })

    it('should return an empty array', async () => {
      return await request(app)
        .get('/items')
        .set('Authorization', token)
        .expect(200)
        .then(response => {
          expect(response.body).toEqual([])
        })
    })
  })

  describe('given some items in db', () => {
    const items = [
      { name: 'test_item_1', quantity: 100 },
      { name: 'test_item_2', quantity: 200 }
    ]

    beforeAll(async () => {
      await db.clearItemsTables()
      await Promise.all(
        items.map(item => {
          return request(app)
            .post('/items')
            .set('Authorization', token)
            .send(item)
        })
      )
    })

    it('should return all items', async () => {
      return request(app)
        .get('/items')
        .set('Authorization', token)
        .expect(200)
        .then(response => {
          expect(response.body).toEqual(
            expect.arrayContaining(
              items.map(item => {
                return expect.objectContaining({
                  name: item.name,
                  quantity: item.quantity
                })
              })
            )
          )
        })
    })
  })
})

describe('POST /items', () => {
  beforeAll(async () => {
    await db.clearItemsTables()
  })

  describe('create an item', () => {
    let id
    const item = {
      name: 'test_item',
      quantity: 100
    }

    it('should return 201', async () => {
      return await request(app)
        .post('/items')
        .set('Authorization', token)
        .send(item)
        .expect(201)
        .then(response => {
          id = response.body.id
          expect(response.body).toMatchObject(item)
        })
    })

    it('should return the item', async () => {
      return request(app)
        .get(`/items/${id}`)
        .set('Authorization', token)
        .expect(200)
        .then(response => {
          expect(response.body).toMatchObject(item)
        })
    })
  })
})

describe('PUT /items', () => {
  beforeAll(async () => {
    await db.clearItemsTables()
  })

  describe('update an item', () => {
    let id
    const item = {
      name: 'test_item',
      quantity: 100
    }
    const updatedItem = {
      name: 'test_item_2',
      quantity: 200
    }

    beforeAll(async () => {
      return request(app)
        .post('/items')
        .set('Authorization', token)
        .send(item)
        .then(response => {
          id = response.body.id
        })
    })

    it('should return 200', async () => {
      return request(app)
        .put(`/items/${id}`)
        .set('Authorization', token)
        .send(updatedItem)
        .expect(200)
        .then(response => {
          expect(response.body).toMatchObject(updatedItem)
        })
    })

    it('should return the updated item', async () => {
      return request(app)
        .get(`/items/${id}`)
        .set('Authorization', token)
        .expect(200)
        .then(response => {
          expect(response.body).toMatchObject(updatedItem)
        })
    })
  })
})

describe('DELETE /items', () => {
  beforeAll(async () => {
    await db.clearItemsTables()
  })

  describe('delete an item', () => {
    let id
    const item = {
      name: 'test_item',
      quantity: 100
    }

    beforeAll(async () => {
      return request(app)
        .post('/items')
        .set('Authorization', token)
        .send(item)
        .then(response => {
          id = response.body.id
        })
    })

    it('should return 200', async () => {
      return request(app)
        .delete(`/items/${id}`)
        .set('Authorization', token)
        .expect(200)
    })

    it('should return 400 when getting item after deletion', async () => {
      return request(app)
        .get(`/items/${id}`)
        .set('Authorization', token)
        .expect(400)
    })

    it('should return 400 when deleting non-existent item', async () => {
      return request(app)
        .delete(`/items/${id}`)
        .set('Authorization', token)
        .expect(400)
    })
  })
})