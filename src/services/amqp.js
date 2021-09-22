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

  // service.publishEmail = async (email, role, todo_id) => {
  //   const client = await amqplib.connect(URL)
  //   const channel = await client.createChannel()
  //   await channel.assertQueue(ACCESSCONTROL_QUEUE);
  //   const result = await channel.sendToQueue(ACCESSCONTROL_QUEUE, Buffer.from(JSON.stringify({email, role, todo_id})), {
  //     contentType: 'application/json'})
  //   // console.log(result)

  //   await channel.close()
  //   await client.close()

  //   return result
  // }

  // service.publishEmail = async (email, role, todo_id) => {
  //   const open = amqplib.connect();
  //   return await open
  //   .then(async function(c) {
  //      return await c.createConfirmChannel().then(async function(ch) {
  //       return await ch.sendToQueue(ACCESSCONTROL_QUEUE, Buffer.from(JSON.stringify({email, role, todo_id})), {},
  //         function(err, ok) {
  //           if (err !== null){
  //             console.warn('Message nacked!');
  //             return 'Message nacked!'
  //           } else {
  //             console.log('Message acked');
  //             return 'Message acked'
  //           }
  //         }
  //       );
  //     })
  //   });    
  // }

  service.publishEmail = async (email, role, todo_id) => {
    const open = amqplib.connect();
    open
      .then(async function (c) {
        c.createConfirmChannel().then(async function (ch) {
          ch.sendToQueue(ACCESSCONTROL_QUEUE, Buffer.from(JSON.stringify({ email, role, todo_id })), {},
            function (err, ok) {
              if (err !== null) {
                console.warn('Message nacked!');
              } else {
                console.log('Message acked');
              }
            }
          );
        })
      });
  }

  return service
}