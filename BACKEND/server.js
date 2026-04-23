require('dotenv').config();
const app = require('./app.js');
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3000;

//je crée un serveur http via express
const server = http.createServer(app);

// je branche le module sur le serveur
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});

app.set("io", io);

// je connecte le socket
io.on("connection", (socket) => {
    console.log("Client connecté:", socket.id);

    socket.on("join_campaign", (campaignId) => {
        socket.join(`campaign_${socket.id} a rejoint campaign-${campaignId}`);
        console.log(`socket ${socket.id} a rejoint campaign ${campaignId}`);
    });

    socket.on("déconnection", () =>{
        console.log("Client déconnecté:", socket.id);
    });
});

server.listen(PORT, () =>{console.log(`server running on port http://localhost:${PORT}`)});