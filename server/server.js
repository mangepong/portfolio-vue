const app = require('express')();
let server = {};


server = require('http').createServer(app);

const io = require('socket.io')(server, { cors: true, origins: false });
const signalServer = require('simple-signal-server')(io)
const port = process.env.PORT || 1337;
const rooms = new Map()

server.listen(port, () => {
   log('Lobby server running on port ' + port);
});

app.get('/', function (req, res) {
   var sum = 0;
   rooms.forEach((v, k) => sum = sum + v.size);
   res.send('Lobby server<br/>rooms: ' + rooms.size + '<br/>members: ' + sum);
});

signalServer.on('discover', (request) => {
   let memberId = request.socket.id;
   let roomId = request.discoveryData;
   let members = rooms.get(roomId);
   if (!members) {
      members = new Set();
      rooms.set(roomId, members);
   }
   members.add(memberId);
   request.socket.roomId = roomId;
   request.discover({
      peers: Array.from(members)
   });
   log('joined ' + roomId + ' ' + memberId)
})

signalServer.on('disconnect', (socket) => {
   let memberId = socket.id;
   let roomId = socket.roomId;
   let members = rooms.get(roomId);
   if (members) {
      members.delete(memberId)
   }
   log('left ' + roomId + ' ' + memberId)
})

signalServer.on('request', (request) => {
   request.forward()
   log('requested')
})

signalServer.on('stop-camera', (req) => {
  console.log(req);
  socket.emit("hello","HAHAHA")
})

function log(message, data) {
   if (true) {
      console.log(message);
      if (data != null) {
         console.log(data);
      }
   }
}