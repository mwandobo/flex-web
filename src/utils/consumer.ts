const amqp = require('amqplib');
const WebSocket1 = require('ws');
// const phpSerialize = require('php-serialize');


const wss = new WebSocket1.Server({ port: 8083 }); // WebSocket server on port 8080

async function connectToRabbitMQ() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queue = 'default';

        await channel.assertQueue(queue, { durable: true });

        console.log('Waiting for messages in %s. To exit press CTRL+C', queue);

        channel.consume(queue, (msg) => {
            if (msg) {
                const message = JSON.parse(msg.content.toString());

                console.log('Received message:', message);

                // const deserializedData = phpSerialize.unserialize(message.data.command);

                // const { text, user_id } = deserializedData.message;
                //
                // console.log('Text:', text); // "Resource Was Requested"
                // console.log('User ID:', user_id); // 1


                // Send message to all connected WebSocket clients
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket1.OPEN) {
                        client.send(JSON.stringify(message));
                    }
                });

                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error('Error in consuming message from RabbitMQ', error);
    }
}

connectToRabbitMQ();
