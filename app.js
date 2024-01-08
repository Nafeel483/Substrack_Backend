const express = require("express");
const connectDB = require("./config/dataBase");
const routes = require('./routes/index');
const Room = require('./models/Rooms');
const { saveMessage } = require('./controllers/messageController');
const dotenv = require('dotenv');

var cors = require('cors')

dotenv.config();

const swaggerUi = require('swagger-ui-express'),
  swaggerDocument = require('./swagger.json');

const app = express();

const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: "*",
  }
});

app.use(cors())
app.use(express.json());
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);
app.use('/api/v1', routes);

const getRoom = async (senId, recId) => {
  try {
    let roomId = senId + recId;
    let room = await Room.findOne({
      roomId: roomId
    });
    if (room) {
      return room;
    }
    else {
      roomId = recId + senId;
      room = await Room.findOne({
        roomId: roomId
      });
      if (room) {
        return room;
      } else {
        let newRoom = await new Room({
          userIdOne: senId,
          userIdTwo: recId,
          roomId: senId + recId,
          active: false
        });
        await newRoom.save();
        return newRoom;
      }
    }
  } catch (error) {
    return {
      error: error,
      status: false
    };
  }
}

const connectMongoDb = async () => {
  const db = await connectDB();
  return db;
}
connectMongoDb();
// io.on('connection', async (socket) => {
//   // await 
//   console.log('a user connected');
//   // console.log("join0", socket.id)
//   socket.on('toBe', async function (msg) {
//     console.log("msg",msg)
//     //   io.emit('toFe',msg)
//     const room = await getRoom(msg.senderId, msg.recId);

//     console.log("socket.id", socket.id)
//     socket.join(room?.roomId);
//     socket.emit("toFe", room?.roomId);
//   })
//   socket.on('messageBe', function (msg) {
//     console.log("msg",msg)
//     //   io.emit('toFe',msg)
//     const data = { message:msg.message, senderId:msg.senderId, recId:msg.recId, roomId:msg?.roomId}
//     saveMessage(data)
//     socket.to(msg?.roomId).emit("messageFe", msg.message);
//   })
//   //   socket.on('chatAgent', function(msg){
//   //   console.log('a user connected',msg);
//   //     io.emit('widget',msg)
//   // })
// });

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => console.log(`Server Started on port ${PORT}`));
