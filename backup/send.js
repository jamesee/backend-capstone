#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

// const URL  = "amqps://acagvept:Q7GP4ne-OB44qjBH_WAW1Mm_nYV4zeRH@clam.rmq.cloudamqp.com/acagvept"
const URL = "amqp://localhost"

amqp.connect(URL, function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

  

        var queue = 'hello';
        // var queue = 'registrations';

        var msg = 'Hello World!';

        channel.assertQueue(queue, {
            durable: false
        });
        channel.sendToQueue(queue, Buffer.from(msg));

        console.log(" [x] Sent %s", msg);
    });

    setTimeout(function() {
        connection.close();
        process.exit(0);
    }, 500);
});
