const router = require('express').Router();
const User = require('../models/User');
const cryptoJs = require('crypto-js');

// Register
router.post('/register', async (req, res)=>{
    const newUser = new User(
        {
            username: req.body.username,
            email: req.body.email,
            password: cryptoJs.AES.encrypt(req.body.password, process.env.SECRET_KEY),
        }
    );

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router