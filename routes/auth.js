const router = require('express').Router();
const User = require('../models/User');
const cryptoJs = require('crypto-js');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
    const newUser = new User(
        {
            username: req.body.username,
            email: req.body.email,
            password: cryptoJs.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString(),
        }
    );

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json(error);
    }
})

// login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(401).json('wrong credientials!')

        const hashPass = cryptoJs.AES.decrypt(user.password, process.env.SECRET_KEY);
        const userPassword = hashPass.toString(cryptoJs.enc.Utf8);
        userPassword !== req.body.password && res.status(401).json('wrong credientials!')

        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
        }, process.env.SECRET_JWT_KEY, { expiresIn: "1d" })

        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });

    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router