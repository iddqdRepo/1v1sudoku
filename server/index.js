import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import sudokuRoutes from "./routes/sudokuRoutes.js";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { addUser, removeUser, getUser, getUsersInRoom, getDataInUserList } from "./users.js";

dotenv.config();

console.log();

const app = express();

const server = createServer(app); //for server to handle socket.io

app.use(express.json({ limit: "30mb", extended: true })); //every requrest that comes in will go through this middleware and be converted to JSON
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
const io = new Server(server, {
  cors: {
    origins: ["*"],
    handlePreflightRequest: (req, res) => {
      res.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST",
        "Access-Control-Allow-Headers": "my-custom-header",
        "Access-Control-Allow-Credentials": true,
      });
    },
  },
});
app.use("/sudoku", sudokuRoutes);

io.on("connection", (socket) => {
  // console.log("New WS connection with id" + socket.id);

  socket.on("join_room", (payload, callback) => {
    //payload is info, callback is error
    console.log("-------------------------------------Joined Room");

    let numberOfUsersInRoom = getUsersInRoom(payload.room).length;
    const { error, newUser } = addUser({
      userId: socket.id,
      username: numberOfUsersInRoom === 0 ? "Player 1" : "Player 2",
      room: payload.room,
    });

    // socket.on("testCall", (payload, callback) =>{
    //   io.to(payload.room).emit("roomData", { room: newUser.room, users: getUsersInRoom(newUser.room) });

    // })

    //If there are more than two people in a room, return an error
    if (error) return callback(error);
    console.log("error is: ", error);

    socket.join(newUser.room);
    console.log("num users in room ", newUser.room, "is ", getUsersInRoom(newUser.room).length);

    // console.log("user list data: ", getDataInUserList());

    //TODO only emit roomData if there is a newUser returned, otherwise error is returned and it crashes
    console.log("Emitting to NewUser.room: ", newUser.room, "room data: ", { room: newUser.room, users: getUsersInRoom(newUser.room) });
    io.to(newUser.userId).emit("roomData", { room: newUser.room, users: getUsersInRoom(newUser.room) });
    io.to(newUser.userId).emit("currentUserData", { name: newUser.userId });

    //? This works for letting the other user know a user has joined their game
    io.in(newUser.room).emit("message", "A User has joined your room");
    io.to(newUser.room).emit("roomData", { room: newUser.room, users: getUsersInRoom(newUser.room) });
  });

  socket.on("start_game", (payload) => {
    //emit to users in room
    console.log("in start game, board is ", payload);
    console.log("socket id is: ", socket.id);
    const user = getUser(socket.id);
    console.log("user is: ", user);
    if (user) {
      io.in(user.room).emit("startGameData", payload);
      console.log("user true, user is: ", user);
    }
  });

  //Welcome connected user
  socket.emit("message", "Welcome to Sudoku!");

  //Broadcast when a player connects
  // socket.broadcast.emit("message", "A user had joined the game");

  //tell other person has disconnected
  socket.on("disconnect", () => {
    console.log("DISCONNECT TRIGGERED");
    const user = removeUser(socket.id);
    if (user) io.to(user.room).emit("roomData", { room: user.room, users: getUsersInRoom(user.room) });
    console.log(`${socket.id} has left the game`);
    io.emit("message", `${socket.id} has left the game`);
  });
});

const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 5000;
mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true, //for warning in the console
    useUnifiedTopology: true, //for warning in the console
  })
  .then(() =>
    server.listen(PORT, () => {
      console.log(`App running on port ${PORT}`);
    })
  )
  .catch((error) => console.log(error.message));
