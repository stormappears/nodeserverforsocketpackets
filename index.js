var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
const lastTimestamp = new Date().getTime();

app.get("/view", (req, res) => {
  res.sendFile(__dirname + "/display.html");
});

io.on("connection", (socket) => {
  socket.on("join-message", (roomId) => {
    socket.sendBuffer = [];
    socket.join(roomId);
    console.log("User joined in a room : " + roomId);
  });

  socket.on("screen-data", function (data) {

    const timestamp = new Date().getTime();

    if (timestamp - lastTimestamp > 5000) {
      // Skip the data
      return;
    }

    socket.sendBuffer = [];
    data = JSON.parse(data);
    var room = data.room;
    var imgStr = data.image;
    socket.broadcast.to(room).emit("screen-data", imgStr);
  });
});

var server_port = process.env.YOUR_PORT || process.env.PORT || 5000;
http.listen(server_port, () => {
  console.log("Started on : " + server_port);
});
