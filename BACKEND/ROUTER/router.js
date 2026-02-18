const express = require('express');
const router = express.Router();
const rollD20 = require('../SERVICES/dices.js');
const modes = require('../JSON/info.json')
const userNames = require('../JSON/userNames.json');


router.get('/', (req, res) =>{
  res.render('index.ejs', { modes });
});

// ici je crée une route /roll qui va éxécuter ma fonction rollD20 et passer à la vue le résultat
router.get('/roll', (req, res) =>{
    let result = rollD20();
    res.json({ result })
});

router.get('/login', (req, res) =>{
    res.render('login.ejs')

});


router.post('/login', (req, res) =>{
    //console.log(req.body);
    // Je récupère temporairement en brut les infos.
    // Je mettrais plus en place un système plus complexe d'Auth et de hashage
   const login = req.body.login.toLowerCase();
   req.session.connectedUser = login;
   const pwd = req.body.password;
   req.session.connectedPwd = pwd;
   console.log(req.session);
    for(const user of userNames){
       const firstName = user.name.toLowerCase();
        const pass = user.password;

     if(req.session.connectedUser === firstName && req.session.connectedPwd === pass){
        req.session.connectedUser = firstName;
       return res.render('profil.ejs', { firstName })
       
    }}

});


router.get('/profil', (req, res) =>{
const firstName = req.session.connectedUser;
    res.render('profil.ejs', { firstName })
    console.log(firstName);
    
});

router.get('/campaign', (req, res) =>{
    
})

module.exports = router;