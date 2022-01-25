const { vrfyToknAndAuther, vrfyToknAndisAdmin } = require('./verifyToken');
const cryptoJs = require('crypto-js');
const router = require('express').Router();
const Product = require('../models/Product')

// Create
router.post('/', vrfyToknAndisAdmin, async (req, res)=>{
    const newProduct = new Product(req.body)

    try {
        const saveProduct = await newProduct.save();
        res.status(200).json(saveProduct);
    } catch (err) {
        res.status(500).json(err)
    }
})

// Update

module.exports = router