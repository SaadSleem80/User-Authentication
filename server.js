const express = require("express");
const app = express();
const connectdb = require("./server/database/connection");
const userRouter = require("./server/router/user_router");
const cookieParser = require("cookie-parser");
require("dotenv").config();

//usecookies
app.use(cookieParser());
// view engine
app.set("view engine", "ejs");
// url encoded
app.use(express.urlencoded({ extended: false }));
// json middelware
app.use(express.json());
// database
connectdb();
// assets
app.use(express.static("assets"));

app.use(userRouter);

// cookies
app.get("/set-cookies", (req, res) => {
  //   res.setHeader("Set-Cookie", "newUser=true");
  res.cookie("newUser", false);
  res.cookie("isEmployee", true, { maxAge: 1000 * 60 * 60 * 24, secure: true });
  res.send("you got the cookie!");
});

app.get("/read-cookies", (req, res) => {
  const cookies = req.cookies;
  console.log(cookies.newUser);
  res.json(cookies);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT);
