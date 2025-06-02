"use strict";
const amqp = require('amqplib');
const WebSocket1 = require('ws');
const wss = new WebSocket1.Server({ port: 8083 }); // WebSocket server on port 8080
async function connectToRabbitMQ() {
    try {
        const connection = await amqp.connect('amqp://guest:guest@127.0.0.1:5672', {
            frameMax: 131072,
            heartbeat: 30
        });
        const channel = await connection.createChannel();
        const queue = 'default';
        await channel.assertQueue(queue, { durable: true });
        console.log('Waiting for messages in %s. To exit press CTRL+C', queue);
        channel.consume(queue, (msg) => {
            if (msg) {
                console.log('Received raw message:', msg.content.toString());
                try {
                    const message = JSON.parse(msg.content.toString());
                    if (message && message.data && message.data.command) {
                        const serializedCommand = message.data.command;
                        const regex = /s:\d+:"message";s:\d+:"(.*?)";/;
                        const match = regex.exec(serializedCommand);
                        if (match && match[1]) {
                            const jsonString = match[1];
                            try {
                                const parsedData = JSON.parse(jsonString);
                                wss.clients.forEach((client) => {
                                    if (client.readyState === WebSocket1.OPEN) {
                                        client.send(JSON.stringify(parsedData));
                                    }
                                });
                            }
                            catch (jsonError) {
                                console.error('Error parsing JSON:', jsonError);
                            }
                        }
                        else {
                            console.error('Failed to extract JSON string from serialized command');
                        }
                        channel.ack(msg);
                    }
                }
                catch (error) {
                    console.error('Error processing message:', error);
                    channel.nack(msg);
                }
            }
        });
        // 🔁 Auto reconnect on close or error
        connection.on('error', (err) => {
            console.error('RabbitMQ connection error:', err.message);
        });
        connection.on('close', () => {
            console.warn('RabbitMQ connection closed. Reconnecting in 5 seconds...');
            setTimeout(connectToRabbitMQ, 5000);
        });
    }
    catch (error) {
        console.error('Error in consuming message from RabbitMQ', error);
        console.log('Retrying to connect in 5 seconds...');
        setTimeout(connectToRabbitMQ, 5000);
    }
}
connectToRabbitMQ();
