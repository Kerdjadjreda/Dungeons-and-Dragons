const express = require('express');
const router = express.Router();
const rollD20 = require('../SERVICES/dices.js');
const modes = require('../JSON/info.json')
const userNames = require('../JSON/userNames.json');


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
    // Je récupère temporairement en brut les infos.
    // Je mettrais plus en place un système plus complexe d'Auth et de hashage
   const login = req.body.login.toLowerCase();
   const pwd = req.body.password;
    for(const user of userNames){
       let firstName = user.name.toLowerCase();
        const pass = user.password;
     if(login === firstName && pwd === pass){
        
       return res.render('profil.ejs', { firstName })
       
    }}

});


/*router.get('/profil', (req, res) =>{

    res.render('profil.ejs', { firstName })
    
});
*/


module.exports = router;