const express = require('express');
const router = require('./ROUTER/router.js')
const path = require('path');
const session = require('express-session');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

const userRouter = require("./ROUTER/userRouter.js")
const campaignsRouter = require("./ROUTER/campaignsRouter.js");
const charactersRouter = require('./ROUTER/charactersRouter.js');
const combatSessionsRouter = require('./ROUTER/combatSessionsRouter.js');
const monstersRouter = require('./ROUTER/monstersRouter.js');
// J'utilise le moteur de rendu EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/VUE')
app.use(express.static(path.join(__dirname, 'PUBLIC')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: [
    "http://localhost:5173",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
};

// ici j'ai besoin de cookieParser pour permettre à express de lire req.cookies. J'ajoute aussi les CORS options pour permettre à mon front de communiquer avec l'API.
app.use(cookieParser());
app.use(cors(corsOptions))

app.use("/monsters", monstersRouter);
app.use("/combat-sessions", combatSessionsRouter);
app.use("/users", userRouter);
app.use("/campaigns", campaignsRouter);
app.use("/characters", charactersRouter);
app.use(router);

module.exports = app;