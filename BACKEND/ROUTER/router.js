const express = require('express');
const router = express.Router();
const rollD20 = require('../SERVICES/dices.js');
const modes = require('../JSON/info.json')

router.get('/', (req, res) =>{
  res.render('index.ejs', { modes });
});

router.get('/roll', (req, res) =>{
    let result = rollD20();
    res.json({ result })
});

router.get('/login', (req, res) =>{
    res.render('login.ejs')
});

router.post('/login', (req, res) =>{
    //console.log(req.body);
   const login = req.body.login;
   const pwd = req.body.password;
     if(login ==="test" && pwd ==="123"){
        
        res.redirect('/profil')
    }

});

router.get('/profil', (req, res) =>{
    res.render('profil')
    
});



module.exports = router;