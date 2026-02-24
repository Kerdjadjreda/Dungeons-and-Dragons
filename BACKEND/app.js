const express = require('express');
const router = require('./ROUTER/router.js')
const path = require('path');
const session = require('express-session');
const app = express();

const userRouter = require("./ROUTER/userRouter.js")
const campaignsRouter = require("./ROUTER/campaignsRouter.js")

// J'utilise le moteur de rendu EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/VUE')
app.use(express.static(path.join(__dirname, 'PUBLIC')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.set('trust proxy', 1) // trust first proxy
//app.use(session({
  //secret: 'keyboard cat',
  //resave: true,
  //saveUninitialized: true,
  //cookie: { secure: false }
//}))
app.use("/campaigns", campaignsRouter);
app.use("/users", userRouter);
app.use(router);

module.exports = app;