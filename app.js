console.log("Web server is Started");
const http = require("http");
const express = require("express");
const app = express();
const router = require("./router");
const router_bssr = require("./router_bssr");
const cors = require("cors");
const cookieParser = require("cookie-parser");

let session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "sessions",
});

// 1 open code
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: true,
  }),
);
app.use(cookieParser());

// 2 Sesseion code
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 30, // for 30 minutes
    },
    store: store,
    resave: true,
    saveUninitialized: true,
  }),
);

app.use(function (req, res, next) {
  res.locals.member = req.session.member;
  next();
});

// 3 Views code
app.set("views", "views");
app.set("view engine", "ejs");

// 4 Routing code

app.use("/shop", router_bssr);
app.use("/", router);
// Post malumotni ozi bilan birga olip keladi va Date base ga yozadi
const server = http.createServer(app);
/****************************
 *SOCKET.IO BACKEND SERVER*
 ***************************/
const io = require("socket.io")(server, {
  serveClient: false,
  origins: "*:*",
  transport: ["Websocket", "xhr-polling"],
});
let online_users = 0;
io.on("connection", function (socket) {
  online_users++;
  console.log("New user", "total:", online_users);
  socket.emit("greetMsg", { text: "Welcome" });
  io.emit("infoMsg", { total: online_users });

  socket.on("disconnect", function () {
    online_users--;
    socket.broadcast.emit("infoMsg", { total: online_users });
    console.log("client disconnected, total:", online_users);
  });
  socket.on("createMsg", function (data) {
  console.log("createMsg", data);
  socket.broadcast.emit("newMsg", data);  
  socket.emit("newMsg", data);            
});
});
/****************************
 *SOCKET.IO BACKEND SERVER*
 ***************************/
module.exports = server;
