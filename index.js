const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const socketIo = require('socket.io');
const cors = require('cors');

// Use `path.join()` to safely resolve paths relative to the project root
const privateKey = fs.readFileSync(path.join(__dirname, 'ssl', 'private.key'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, 'ssl', 'certificate.crt'), 'utf8');
const ca = fs.readFileSync(path.join(__dirname, 'ssl', 'ca-bundle.crt'), 'utf8');

// Create an Express application
const app = express();

console.log('start... welcome to rnd.pbbedahulu.my.id');
// app.get('/', async (req, res) => { 
//   console.log('welcome to rnd.pbbedahulu.my.id');
//   return res.send('welcome to rnd.pbbedahulu.my.id');
// });

app.get('/tes', async (req, res) => { 
  console.log('welcome to tes rnd.pbbedahulu.my.id');
  return res.send('welcome to tes socket io');
});
// Create an HTTPS server with your SSL certificates
// const server = https.createServer({
//     key: privateKey,
//     cert: certificate,
//     ca: ca  // Optional, if you have a CA bundle
// }, app);
// Create an HTTP server (no SSL binding here)
const server = http.createServer(app);

// Bind Socket.IO to the HTTPS server
const io = socketIo(server, {
    cors: {
        origin: "*", // Allow all origins (adjust as needed for security)
        methods: ["GET", "POST"]
    }
});

app.use(cors());

// Serve static files from the "public" directory
app.use(express.static('public'));

io.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

// Listen for new connections to Socket.IO
io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for chat messages
    socket.on('chat message', (msg) => {
        console.log('Message: ' + msg);
        io.emit('chat message', msg);
    });

    // Listen for user disconnections
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3304;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
