const express = require("express");
const User = require("../models/user");
const { ensureAdmin, adminOrSameUser } = require("../middleware/auth");

const router = express.Router();


router.get("/", ensureAdmin, async function(req, res, next){
    try{
        const users = await User.findAll();
        return res.json(users);
    }catch(err){
        return next(err);
    }
})

router.get('/:username', adminOrSameUser, async function(req,res,next){
    try{
        const userInfo = await User.get(req.params.username);
        return res.json(userInfo);
    }catch(err){
        return err;
    }
})

module.exports = router;