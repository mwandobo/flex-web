import amqp from 'amqplib';

async function consumeMessages() {
    try {
        const connection = await amqp.connect('amqp://guest:guest@127.0.0.1:5672');
        const channel = await connection.createChannel();

        const queue = 'default';
        await channel.assertQueue(queue, { durable: true });

        console.log(`[*] Waiting for messages in ${queue}. To exit press CTRL+C`);

        channel.consume(queue, (msg) => {
            if (msg) {
                console.log(`[x] Received: ${msg.content.toString()}`);
                channel.ack(msg);
            }
        });

    } catch (error) {
        console.error('RabbitMQ Connection Error:', error);
    }
}