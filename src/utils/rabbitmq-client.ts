// rabbitmqClient.ts

import amqp, { Connection, Channel, ConsumeMessage } from 'amqplib';

async function consumeMessages() {
    try {
        const connection: Connection = await amqp.connect('amqp://guest:guest@127.0.0.1:5672');
        const channel: Channel = await connection.createChannel();
        const queue = 'default';

        await channel.assertQueue(queue, { durable: true });
        console.log(`Listening for messages in queue: ${queue}`);

        channel.consume(queue, (msg: ConsumeMessage | null) => {
            if (msg) {
                const content = msg.content.toString();
                console.log("Received message:", content);

                // Acknowledge the message
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error("Error consuming messages:", error);
    }
}

export { consumeMessages };
