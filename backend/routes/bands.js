const express = require ('express');
const Band = require('../models/band');
const { ensureAdmin } = require('../middleware/auth');
const router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({destination: 'images/',
    filename: function(req,file,next){
    console.log("ran");
    next(null,file.originalname.split('.')[0]+Date.now() +'.'+ file.originalname.split('.').pop());
}});
const jsonschema = require ('jsonschema');
const Genre = require('../models/genre');
const upload = multer({storage: storage});

router.get('/', async function(req,res,next){
    try{
        const bands = await Band.findAllBands(req.query);
        console.log(bands);
        return res.json(bands);
    }catch(err){
        return next(err);
    }
})

router.get('/:id', async function(req,res,next){
    try{
        const band = await Band.getBand(req.params.id);
        return res.json(band);
    }catch(err){
        return next(err);
    }
})

router.post('/', upload.single('image'), ensureAdmin, async function(req,res,next){
    try{
        let band = req.body;
        const genres = band.genres;
        delete band.genres;
        console.log(req.file);
        if(req.file){
            band= {...band, imageURL: req.file.path};
        }
        delete band.image;
        console.log(band);
        const newBand = await Band.makeBand(band);
        for(let genre of genres){
            Genre.attachToBand(newBand.id, genre);
        }
        return res.json(band);
    }catch(err){
        return next(err);
    }
})

router.patch('/:id', upload.single('image'), ensureAdmin, async function(req,res,next){
    try{
        let band = req.body;
        const genres = band.genres;
        delete band.genres;
        if(req.file){
            band.imageURL = req.file.path;
        }
        delete band.image;
        const newBand = await Band.updateBand(req.params.id, band);
        console.log(newBand)
        await Genre.detachAllFromBand(req.params.id);
        for(let genre of genres){
            console.log(genre);
            await Genre.attachToBand(newBand.id, genre);
        }
        return res.json(band);
    }catch(err){
        return next(err);
    }
})

router.delete('/:id', ensureAdmin, async function(req,res,next){
    try{
        await Band.deleteBand(req.params.id);
        return res.status(200);
    }catch(err){
        return next(err);
    }
})



module.exports = router;