var express = require('express');
var bodyParser = require('body-parser');
var uuidv4 = require('uuid/v4');

var app = express();
var expressWs = require('express-ws')(app);

console.log('Starting WebSocket Server');

function sendMessage(wss, message, severity) {
  const messageUID = uuidv4();
  wss.clients.forEach(client =>
    client.send(JSON.stringify({ id: messageUID, message: message, severity: severity }))
  );
}

// patch missing CTRL+C handling on Windows platforms
if (process.platform === 'win32') {
  require('readline')
    .createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    .on('SIGINT', function() {
      process.emit('SIGINT');
    });
}

process.on('SIGINT', function() {
  // graceful shutdown
  console.log('Shutting down');
  expressWs.getWss().close();
  process.exit();
});

// Add middleware to handle message body
app.use(bodyParser.json());

// Add REST endpoint to generate new notification messages (for demonstration)
app.post('/notification', (req, res) => {
  const message = (req.body && req.body.message) || 'empty';
  const severity = (req.body && req.body.severity) || 'empty';
  sendMessage(expressWs.getWss(), message, severity);
  return res.send(`POST notification ${message} ${severity}`);
});

app.ws('/', (ws, req) => {
  ws.on('message', message => {
    console.log('received: %s', message);
    const body = message ? JSON.parse(message) : 'empty';
    ws.send(JSON.stringify({ bouncing: body }));
  });
});

app.listen(3210);
