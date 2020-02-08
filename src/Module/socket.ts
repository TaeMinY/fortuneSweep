import roomDB from "./roomDB";
function socket(io) {
  io.sockets.on("connection", socket => {
    console.log("socket 서버 접속 완료 ");
    socket.on("SendServer", data => {
      socket.emit("sendClient", data);
    });
    socket.on("Join", _id => {
      socket.join(_id);
      let rooms = roomDB.searchAll();
      let room = rooms.filter(value => value._id == _id);
      io.sockets.in(_id).emit("RoomLoad", room[0]);
      var MainLoad = [];
      roomDB.searchAll().forEach((data, index) => {
        MainLoad[index] = {
          _id: data._id,
          roomname: data.roomname,
          personnel: data.personnel,
          connectedUsers: data.connectedUsers,
          passwordLock: data.passwordLock,
          progress: data.progress
        };
      });
      socket.emit("sendMainRoom", MainLoad[0]);
    });
    socket.on("MainLoad", data => {
      var MainLoad = [];
      roomDB.searchAll().forEach((data, index) => {
        MainLoad[index] = {
          _id: data._id,
          roomname: data.roomname,
          personnel: data.personnel,
          connectedUsers: data.player.length,
          passwordLock: data.passwordLock,
          progress: data.progress
        };
      });
      socket.emit("sendMainRoom", { value: MainLoad });
    });
    socket.on("sendMessage", data => {
      const dataArray = data.split("/");
      console.log(dataArray);
      io.sockets.in(dataArray[0]).emit("getMessage", data);
    });
    socket.on("RoomLeave", data => {
      console.log(data);
      const dataArray = data.split("/");
      io.sockets.in(dataArray[0]).emit("getLeaveMessage", dataArray[1]);
      socket.leave(dataArray[0]);
      const room = roomDB
        .searchAll()
        .filter(value => value._id == dataArray[0]);

      io.sockets.in(dataArray[0]).emit("RoomLoad", room[0]);
      var MainLoadAll = MainLoad();
      socket.emit("sendMainRoom", MainLoadAll);
    });
    socket.on("SendStart", data => {
      io.sockets.in(data).emit("GetStart", true);
    });
    socket.on("SendScore", data => {
      const dataArray = data.split("/");
      let getArray = [];
      getArray = roomDB.score(dataArray);
      io.sockets.in(dataArray[0]).emit("GetScore", { value: getArray });
    });

    socket.on("SendPlayerState", data => {
      const dataArray = data.split("/");
      io.sockets.in(dataArray[0]).emit("GetPlayerState", dataArray[1]);
    });
    socket.on("SendGameTime", data => {
      const dataArray = data.split("/");
      io.sockets.in(dataArray[0]).emit("GetGameTime", dataArray[1]);
    });
    socket.on("GameOver", data => {
      const password = roomDB.password(data);
      io.sockets.in(data).emit("GetGameOver", true);
    });
    socket.on("SendSpawnObj", data => {
      const dataArray = data.split("/");
      io.sockets.in(dataArray[0]).emit("GetSpawnObj", dataArray[1]);
    });
    socket.on("PlayerSpawnPoint", data => {
      const dataArray = data.split("/");
      io.sockets.in(dataArray[0]).emit("GetPlayersData", dataArray[1]);
    });
  });
}
function MainLoad() {
  var MainLoad = [];
  roomDB.searchAll().forEach((data, index) => {
    MainLoad[index] = {
      _id: data._id,
      roomname: data.roomname,
      personnel: data.personnel,
      connectedUsers: data.connectedUsers,
      passwordLock: data.passwordLock,
      progress: data.progress
    };
  });
  return MainLoad;
}
export default socket;
