require('dotenv').config()
const amqplib = require('amqplib')

const URL = process.env.CLOUDAMQP_URL || 'amqp://localhost'
const QUEUE = 'registrations'
const ACCESSCONTROL_QUEUE = "access_controls"

module.exports = () => {
  const service = {}

  service.publishRegistration = async (message) => {
    const client = await amqplib.connect(URL)
    const channel = await client.createChannel()
    await channel.assertQueue(QUEUE);
    channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(message)), {
      contentType: 'application/json',
    })
    await channel.close()
    await client.close()
  }
  
  service.publishEmail = async (email, todo_id) => {
    const client = await amqplib.connect(URL)
    const channel = await client.createChannel()
    await channel.assertQueue(ACCESSCONTROL_QUEUE);
    channel.sendToQueue(ACCESSCONTROL_QUEUE, Buffer.from(JSON.stringify({email, todo_id})), {
      contentType: 'application/json',
    })
    await channel.close()
    await client.close()
  }

  return service
}