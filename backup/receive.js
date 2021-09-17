#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

const URL = "amqp://localhost";

// const URL  = "amqps://acagvept:Q7GP4ne-OB44qjBH_WAW1Mm_nYV4zeRH@clam.rmq.cloudamqp.com/acagvept";

amqp.connect(URL, function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

       // var queue = 'registrations';
        var queue = 'hello';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function(msg) {
            console.log(" [x] Received %s", msg.content.toString());
        }, {
            noAck: true
        });
    });
});
