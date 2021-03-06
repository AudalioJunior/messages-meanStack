const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');


router.post('/createUser', async (req, res) => {
    try {
        const user = new User({
            userName: req.body.userName,
            password: req.body.password
        })
    
        user.save();
        return res.json({message: 'Usuário cadastrado com sucesso!'});
    } catch (err) {
        return res.status(400).json({error: 'Error ao cadastrar'})
    }
})

router.post('/auth', async (req, res) => {
    const {userName, password} = req.body;
    const user = await User.findOne({userName}).select('+password');

    if(!user){
        return res.status(400).json({error: 'Usuário não encontrado!'})
    }

    if(!await bcrypt.compare(password, user.password)){
        return res.status(400).json({error: 'Senha inválida!'})
    }

    user.password = undefined;
    
    const token = jwt.sign({id:user._id}, authConfig.secret, {
        expiresIn: 10800
    });

    res.json({user, token});
})

module.exports = router;