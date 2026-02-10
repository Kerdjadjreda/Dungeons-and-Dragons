const express = require('express');
const router = require('./ROUTER/router.js')
const path = require('path');

const app = express();


// J'utilise le moteur de rendu EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/VUE')
app.use(express.static(path.join(__dirname, 'PUBLIC')));
app.use(express.urlencoded({ extended: true }));
app.use(router);

module.exports = app;