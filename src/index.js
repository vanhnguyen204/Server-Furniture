import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import createEngine from 'express-handlebars'
import routes from "./routes/index.js";
import connect from "./config/db/index.js";
import ipAddress from "./utils/ipAddress.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import IpAddress from "./utils/ipAddress.js";
import dotenv from 'dotenv';
import ProductController from './app/controllers/ProductController.js';
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = 3000;
const socketPort = 8080;
const server = http.createServer(app);
const io = new Server(server);


// Template engine

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
routes(app);

// Database connection
connect();


// Start the server
app.listen(port, IpAddress, () => {
    console.log(`Furniture is listening at http://${ipAddress}:${port}`);
});
// Socket.io server

// Socket.io
// io.on('connection', (socket) => {
//     console.log('Connection socket.io')
//     ProductController.socketNotification(socket, io)

// });

server.listen(socketPort, ipAddress, () => {
    console.log('Socket.io is listening')
})