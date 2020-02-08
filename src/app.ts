import * as express from 'express';
import * as compression from 'compression';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as cors from 'cors';
import Router from "./Routers/index";
import roomDB from "./Module/roomDB";
import socket from "./Module/socket";
roomDB.setting();
const app: express.Application = express();
const connectDB = require('./Module/connectDB');
const PORT = process.env.PORT || 4000;
const http = require("http");
const server = http.createServer(app);
connectDB();
require('dotenv').config();
app.use(morgan("dev"));
app.use(compression());
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "30mb" }));
app.use(express.static("public"));
app.use("/", Router);
app.get("/", (req: express.Request, res: express.Response) => {
	res.send("Hello World!!!!");
});
server.listen(PORT, () => {
    console.log(`http://localhost:${PORT} OnOn`);
});
const socketio = require('socket.io');
const io = socketio.listen(51234, { 'destroy buffer size': Infinity });
socket(io)
