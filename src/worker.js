require('dotenv').config()
const amqplib = require('amqplib')
// const AccessControl = require('./models/access-control')
// const db = require('./db')
const AccessControlsService = require('./services/access-controls')
const db = require('./db')


const URL = process.env.CLOUDAMQP_URL || 'amqp://localhost'
const ACCESSCONTROL_QUEUE = "access_controls"
const service = AccessControlsService(db)

async function main () {
  const client = await amqplib.connect(URL)
  const channel = await client.createChannel()
  await channel.assertQueue(ACCESSCONTROL_QUEUE)
  channel.consume(ACCESSCONTROL_QUEUE, async (msg) => {
    const data = JSON.parse(msg.content)
    console.log('Received:', data)

    service.registerAccessControl(data.email, data.todo_id)
    .then(()=>{
      console.log("[INFO] Successfully inserted data into access_control table")
      channel.ack(msg)
    })
    .catch((err) => {
      console.log(err)
      channel.ack(msg)
    })
  })
}

main().catch(err => {
  console.log(err)
})
