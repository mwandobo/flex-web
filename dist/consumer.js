var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var amqp = require('amqplib');
var WebSocket1 = require('ws');
var wss = new WebSocket1.Server({ port: 8083 }); // WebSocket server on port 8080
function connectToRabbitMQ() {
    return __awaiter(this, void 0, void 0, function () {
        var connection, channel_1, queue, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, amqp.connect('amqp://localhost')];
                case 1:
                    connection = _a.sent();
                    return [4 /*yield*/, connection.createChannel()];
                case 2:
                    channel_1 = _a.sent();
                    queue = 'default';
                    return [4 /*yield*/, channel_1.assertQueue(queue, { durable: true })];
                case 3:
                    _a.sent();
                    console.log('Waiting for messages in %s. To exit press CTRL+C', queue);
                    channel_1.consume(queue, function (msg) {
                        if (msg) {
                            console.log('Received raw message:', msg.content.toString());
                            try {
                                var message = JSON.parse(msg.content.toString());
                                if (message && message.data && message.data.command) {
                                    var serializedCommand = message.data.command;
                                    // Extract the message part from the serialized command string
                                    var regex = /s:\d+:"message";s:\d+:"(.*?)";/;
                                    var match = regex.exec(serializedCommand);
                                    if (match && match[1]) {
                                        var jsonString = match[1]; // Extract the JSON string
                                        // Now parse it as a JSON object
                                        try {
                                            var parsedData_1 = JSON.parse(jsonString);
                                            // Send it to WebSocket clients
                                            wss.clients.forEach(function (client) {
                                                if (client.readyState === WebSocket1.OPEN) {
                                                    client.send(JSON.stringify(parsedData_1));
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
                                    channel_1.ack(msg);
                                }
                            }
                            catch (error) {
                                console.error('Error processing message:', error);
                                channel_1.nack(msg); // Optionally nack the message to retry processing
                            }
                        }
                    });
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error('Error in consuming message from RabbitMQ', error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
connectToRabbitMQ();
