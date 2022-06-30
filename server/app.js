const express = require("express");
const methodOverride = require('method-override');
const multer = require('multer');

const app = express();
const http = require('http').Server(app);
const dotenv = require('dotenv');

// winston logger
const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
const expressWinston = require('express-winston');

const logDir = 'logs';  // logs 디렉토리 하위에 로그 파일 저장
const { combine, timestamp, colorize, json } = winston.format;

const db = require('./persistence');
const getContents = require('./routes/getContents');
const addContent = require('./routes/addContent');
const deleteContent = require('./routes/deleteContent');

const constants = require('./lib/constants');
const jwt = require('./lib/jwt');

dotenv.config();

// socket.io 에서 cors 허용
// 설정 보완 필요
const io = require('socket.io')(http, {
  cors: {
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 9081;
const SOCKET_PORT = 9082;

// api 서버에서 cors 허용
const cors = require('cors');
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer().single());
app.use(multer().array());
app.use(multer().fields());
app.use(methodOverride());

const winstonLogFormat = {
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
      colorize(),
      json()
    ),
  transports: [
    // info 레벨 로그를 저장할 파일 설정
    new winstonDaily({
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir,
      filename: `%DATE%.log`,
      maxFiles: 10,  // 10일치 로그 파일 저장
      // zippedArchive: true, 
    }),
    // error 레벨 로그를 저장할 파일 설정
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/error',  // error.log 파일은 /logs/error 하위에 저장 
      filename: `%DATE%.error.log`,
      maxFiles: 10,
      // zippedArchive: true,
    }),
  ],
}

app.use(expressWinston.logger(winstonLogFormat));
app.use(expressWinston.errorLogger(winstonLogFormat));

app.post("/contents/add/callback", addContent);
app.post("/contents/delete/callback", deleteContent);
app.get("/contents/list", getContents);

app.get("/contents/play", (req, res, next) => {
  let payload = {
    mc: [{
      mckey: req.query.mckey,
    }],
    cuid: process.env.CLIENT_USER_ID,
    expt: Math.round((new Date()).getTime() / 1000) + constants.EXPIRE_TIME
  };
  
  res.json({jwt : jwt.sign(payload), customKey : process.env.CUSTOM_USER_KEY});
});

app.post("/contents/upload", (req, res, next) => {
  res.json({message:"Hello, World!"});
});

app.get("/contents/download", (req, res, next) => {
  res.json({message:"Hello, World!"});
});

app.get("/contents/download/refresh", (req, res, next) => {
  res.json({message:"Hello, World!"});
});

// lms callback
app.get('/lms/callback', (req, res, next) => {
  //request 처리 후
  io.emit('lms/response', req);
});

// ----- example code -----

app.get("/", (req, res, next) => {
  console.log("Hello, World!");
  // res.redirect("/");
});

// ----- socket.io sample start -----
app.get('/socket-sample', (req, res, next) => {
  res.sendFile(__dirname + '/socket-sample.html');
});

io.on('connection', (socket) => {
  socket.on('socket-sample', msg => {
    io.emit('socket-sample', msg);
  });
});
// ----- socket.io sample end -----


db.init().then(() => {
  app.listen(PORT,
    console.log(`Server started on port http://localhost:${PORT}`));
  
  http.listen(SOCKET_PORT, () => {
    console.log(`Socket.IO Server started on http://localhost:${SOCKET_PORT}`);
  });
}).catch((err) => {
  console.error(err);
  process.exit(1);
});

const gracefulShutdown = () => {
  db.teardown()
      .catch(() => {})
      .then(() => process.exit());
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // Sent by nodemon
