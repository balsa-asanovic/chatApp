const express = require("express");
const app = express();

const http = require("http");
const cors = require("cors");

const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

let users = [];

io.on("connection", (e) => {

    // server-side listener for join_chat emit, when user get's though the initial form
    // returns false if the same username is already connected
    // otherwise returns true for and returns users ID
    e.on("join_chat", (data) => {
        if (users.find((user) => user.username === data)) {
            e.emit("join_status", false);
        } else {
            users.push({id: e.id, username: data});
            io.sockets.emit("users_list", users);
            e.emit("join_status", true);
            e.emit("id", e.id);
        }
    });

    // listener for message send, which then emits message to destination id
    e.on("send_message", (data) => {
        io.to(data.id).emit("receive_message", data);
    });

    // listener for disconnect event, removes user from the list when it happens and emits the new list
    e.on("disconnect", () => {
        users = users.filter((item) => item.id !== e.id);
        io.sockets.emit("users_list", users);
    });
});

server.listen(5000);