const router = require('express').Router();

router.get('/usertest', (req, res)=>{
    res.send('Hello user')
    console.log('user test end point');
})
router.post('/userposttest', (req, res)=>{
    const username = req.body.username
    console.log('username: ', username);
})
module.exports = router