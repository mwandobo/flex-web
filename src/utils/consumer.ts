const amqp = require('amqplib');
const WebSocket1 = require('ws');
const phpSerialize = require('php-serialize');


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
                console.log('Received raw message:', msg.content.toString());

                try {
                    const message = JSON.parse(msg.content.toString());

                    if (message && message.data && message.data.command) {
                        const serializedCommand = message.data.command;

                        // Extract the message part from the serialized command string
                        const regex = /s:\d+:"message";s:\d+:"(.*?)";/;
                        const match = regex.exec(serializedCommand);

                        if (match && match[1]) {
                            const jsonString = match[1]; // Extract the JSON string

                            // Now parse it as a JSON object
                            try {
                                const parsedData = JSON.parse(jsonString);

                                // Extract the new fields from the parsed data
                                const { text, user_id, for_name, for_id } = parsedData;

                                // Send it to WebSocket clients
                                wss.clients.forEach(client => {
                                    if (client.readyState === WebSocket1.OPEN) {
                                        // Include the new fields in the WebSocket message
                                        client.send(JSON.stringify({ text, user_id, for_name, for_id }));
                                    }
                                });
                            } catch (jsonError) {
                                console.error('Error parsing JSON:', jsonError);
                            }
                        } else {
                            console.error('Failed to extract JSON string from serialized command');
                        }

                        channel.ack(msg);
                    }
                } catch (error) {
                    console.error('Error processing message:', error);
                    channel.nack(msg);  // Optionally nack the message to retry processing
                }
            }
        });
    } catch (error) {
        console.error('Error in consuming message from RabbitMQ', error);
    }
}

connectToRabbitMQ();
