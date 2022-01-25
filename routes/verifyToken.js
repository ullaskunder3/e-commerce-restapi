const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next)=>{
    const authHeader = req.headers.token;
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.SECRET_JWT_KEY, (err, user)=>{
            if(err) res.status(403).json('Invalid token');
            req.user = user;
            next();
        });
    }else{
        return res.status(401).json("User is not authenticated!")
    }
}
const vrfyToknAndAuther = (req, res, next)=>{
    verifyToken(req, res, ()=>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        }else{
            res.status(403).json("Unauthorized!")
        }
    })
}
const vrfyToknAndisAdmin = (req, res, next)=>{
    verifyToken(req, res, ()=>{
        if(req.user.isAdmin){
            next();
        }else{
            res.status(403).json("Unauthorized!")
        }
    })
}
module.exports = {verifyToken, vrfyToknAndAuther, vrfyToknAndisAdmin};