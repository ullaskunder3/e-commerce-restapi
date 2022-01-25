const { vrfyToknAndAuther, vrfyToknAndisAdmin } = require('./verifyToken');
const cryptoJs = require('crypto-js');
const router = require('express').Router();
const User = require('../models/User')

// Update
router.put('/:id', vrfyToknAndAuther, async (req, res) => {
    if (req.body.password) {
        req.body.password = cryptoJs.AES.decrypt(req.body.password, process.env.SECRET_KEY).toString()
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        )
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err)
    }
})

// Delete
router.delete('/:id', vrfyToknAndAuther, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id)
        res.status(200).json("User has been deleted successfully!")
    } catch (err) {
        res.status(500).json(err)
    }
})

// Get user
router.get('/find/:id', vrfyToknAndisAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err)
    }
})

// Get all user
router.get('/', vrfyToknAndisAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const users = query ? await User.find().sort({ _id: -1 }).limit(5) : await User.find()
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err)
    }
})

// get user stats

router.get('/stats', vrfyToknAndisAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const date = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 },
                }
            }
        ]
        )
        res.status(200).json(date)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router