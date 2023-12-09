const express = require('express');
const Genre = require('../models/genre');
const router = express.Router();

router.get('/', async function(req,res,next){
    try{
        const search = req.query.search||"";
        const onlyNames = req.query.onlyNames||false;
        const genres = await Genre.findAll(search, onlyNames);
        console.log(genres);
        return res.json(genres);
    }catch(err){
        return next(err);
    }
})

router.post('/', async function(req,res,next){
    try{
        const result = await Genre.makeGenre(req.body);
        return res.status(201).json(result);
    }catch(err){
        return next(err);
    }
})

router.get('/:id', async function(req,res,next){
    try{
        const result = await Genre.getRelated(req.params.id);
        console.log(result);
        return res.json(result);
    }catch(err){
        return next(err);
    }
})

module.exports=router;