const express = require("express");
const methodOverride = require("method-override");
const multer = require("multer");

const app = express();
const http = require("http").Server(app);
const dotenv = require("dotenv");

// winston logger
const winston = require("winston");
const winstonDaily = require("winston-daily-rotate-file");
const expressWinston = require("express-winston");

const logDir = "logs"; // logs 디렉토리 하위에 로그 파일 저장
const { combine, timestamp, colorize, json } = winston.format;

const db = require("./persistence");

const addRouter = require("./routes/content/add");
const listRouter = require("./routes/content/list");
const updateRouter = require("./routes/content/update");
const deleteRouter = require("./routes/content/delete");
const drmRouter = require("./routes/content/drm");
const playRouter = require("./routes/content/play");
const uploadRouter = require("./routes/content/upload");

dotenv.config();

// socket.io 에서 cors 허용
// 설정 보완 필요
const io = require("socket.io")(http, {
  cors: {
    origin: ['http://localhost', 'http://localhost:9080', 'http://react.videoclouds.net'],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 9081;
const SOCKET_PORT = process.env.SOCKET_PORT || 9082;

// api 서버에서 cors 허용
const cors = require("cors");
app.use(cors({
  origin: ['http://localhost', 'http://localhost:9080', 'http://react.videoclouds.net'],
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const winstonLogFormat = {
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    colorize(),
    json()
  ),
  transports: [
    // info 레벨 로그를 저장할 파일 설정
    new winstonDaily({
      level: "info",
      datePattern: "YYYY-MM-DD",
      dirname: logDir,
      filename: `%DATE%.log`,
      maxFiles: 10, // 10일치 로그 파일 저장
      // zippedArchive: true,
    }),
    // error 레벨 로그를 저장할 파일 설정
    new winstonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: logDir + "/error", // error.log 파일은 /logs/error 하위에 저장
      filename: `%DATE%.error.log`,
      maxFiles: 10,
      // zippedArchive: true,
    }),
  ],
};

app.use(expressWinston.logger(winstonLogFormat));
app.use(expressWinston.errorLogger(winstonLogFormat));

app.use("/add", addRouter);
app.use("/list", listRouter);
app.use("/update", updateRouter);
app.use("/delete", deleteRouter);
app.use("/drm", drmRouter);
app.use("/play", playRouter);
app.use("/upload", uploadRouter);

let lmsCallbackSleep = 0;
app.get("/config/lms-callback/sleep/:count", async (req, res, next) => {
  lmsCallbackSleep = req.params.count;
  res.json({status:"success", sleep:lmsCallbackSleep});
});

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
app.post("/lms-callback", async(req, res, next) => {
  if(lmsCallbackSleep>0) await delay(lmsCallbackSleep)

  io.emit("lms-callback-response/"+req.body.uval0, req.body);
  res.json(req.body);
});

/* #################### SAMPLE CODE ####################
app.get("/", (req, res, next) => {
  console.log("Hello, World!");
  // res.redirect("/");
});

// file upload
var upload = multer({ dest: "tmp/" });
app.post("/content/upload", upload.single("content"), (req, res, next) => {
  console.log(req);
  res.json({ message: "Hello, World!" });
});
*/

/* #################### socket.io SAMPLE CODE ####################
app.get("/socket-sample", (req, res, next) => {
  res.sendFile(__dirname + "/socket-sample.html");
});

io.on("connection", (socket) => {
  socket.on("socket-sample", (msg) => {
    io.emit("socket-sample", msg);
  });
});

// one-direction response
// app.get('/lms/callback', (req, res, next) => {
//   io.emit('lms/response', req);
// });
*/

db.init()
  .then(() => {
    app.listen(
      PORT,
      console.log(`Server started on port http://localhost:${PORT}`)
    );

    http.listen(SOCKET_PORT, () => {
      console.log(
        `Socket.IO Server started on http://localhost:${SOCKET_PORT}`
      );
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

const gracefulShutdown = () => {
  db.teardown()
    .catch(() => {})
    .then(() => process.exit());
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
process.on("SIGUSR2", gracefulShutdown); // Sent by nodemon
