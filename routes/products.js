const express =require('express')

const router = express.Router();


router.get('/', function(req,res){
    res.send("list all products")
})

router.get('/create', function(req,res){
    res.send("create products")
})

module.exports = router