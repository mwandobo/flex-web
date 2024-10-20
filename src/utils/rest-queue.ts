type RequestFn = () => Promise<any>;

class RequestQueue {
    private queue: RequestFn[] = [];
    private isProcessing: boolean = false;
    private maxConcurrent: number;
    private interval: number;

    constructor(maxConcurrent: number = 3, interval: number = 1000) {
        this.maxConcurrent = maxConcurrent;
        this.interval = interval;
    }

    async pushRequest(requestFn: RequestFn): Promise<any> {
        return new Promise((resolve, reject) => {
            this.queue.push(() => requestFn().then(resolve).catch(reject));

            // If not already processing, start processing the queue
            if (!this.isProcessing) {
                this.processQueue();
            }
        });
    }

    private async processQueue() {
        if (this.queue.length === 0) {
            this.isProcessing = false;
            return;
        }

        this.isProcessing = true;
        const concurrentRequests = this.queue.splice(0, this.maxConcurrent);

        // Execute all concurrent requests and wait for them to finish
        await Promise.all(concurrentRequests.map(requestFn => requestFn()));

        // Wait before processing the next batch
        await new Promise(resolve => setTimeout(resolve, this.interval));

        // Continue processing the queue
        this.processQueue();
    }
}

const interval = 0
const requestQueue = new RequestQueue(1, interval); // 3 requests every 2 seconds
export default requestQueue;
