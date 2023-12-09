const express = require('express');
const Record = require('../models/record');
const Band = require('../models/band');
const Order = require('../models/order');
const { checkLoggedIn, ensureAdmin, ensureSameUser } = require('../middleware/auth');
const router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({destination: 'images/',
    filename: function(req,file,next){
    console.log("ran");
    next(null,file.originalname.split('.')[0]+Date.now() +'.'+ file.originalname.split('.').pop());
}});
const jsonschema = require ('jsonschema');
const upload = multer({storage: storage});
const newRecordSchema = require('../schemas/recordNew.json');
const updateRecordSchema = require('../schemas/recordUpdate.json');
const { BadRequestError } = require('../expressError');
const Genre = require('../models/genre');
const Review = require('../models/review');
const Listing = require('../models/listing');

router.get('/:id', async function(req,res,next){
    try{
        const id = req.params.id;
        const record = await Record.findRecord(id);
        return res.json(record);
    }catch(err){
        return next(err);
    }
})

router.get('/', async function(req,res,next){
    try{
        const records = await Record.findAll(req.query);
        return res.json(records);
    }catch(err){
        return next(err);
    }
})

router.post('/', upload.single('image'), ensureAdmin, async function(req,res,next){
    try{
        const record = req.body;
        const validator = jsonschema.validate(record, newRecordSchema);
        console.log(validator);
        if(!validator.valid) throw new BadRequestError("Not valid record data");
        const existingBand = await Band.findBandByName(record.band);
        if(existingBand){
            record.band_id = existingBand.id;
        }else{
            const newBand = await Band.makeBand({name: record.band});
            record.band_id = newBand.id;
        }
        recordData = {title: record.title, band_id: record.band_id};
        if(req.file.path){
            recordData = {...recordData, "imageURL": req.file.path};
        }
        const newRecord = await Record.makeRecord(recordData);
        console.log(record);
        for(let genre of record.genres){
            await Genre.attachToRecord(newRecord.id, genre);
        }
        return res.status(201).json({newRecord});
    }catch(err){
        console.log(err);
        return next(err);
    }
})

router.post('/order/:id', checkLoggedIn, async function(req,res,next){
    try{
        const user = res.locals.user;
        const id = req.params.id;
        const result = await Order.makeOrder(id, user.username);
        console.log(result);
        return res.status(201).json(result);
    }catch(err){
        return err;
    }
})

router.patch('/:id', upload.single('image'), ensureAdmin, async function(req,res,next){
    try{
        let record = req.body;
        console.log(req.file);
        if(req.file){
            record = {...record, "imageURL": req.file.path};
            console.log("added image: ", req.file.path);
        }
        delete record.image;
        const validator = jsonschema.validate(record, updateRecordSchema);
        console.log(validator);
        if(!validator.valid) throw new BadRequestError("Not valid record data");
        if(record.band){
            const existingBand = await Band.findBandByName(record.band);
            if(existingBand){
                record.band_id = existingBand.id;
            }else{
                const newBand = await Band.makeBand({name: record.band});
                record.band_id = newBand.id;
            }
            record = {...record, band_id: record.band_id};
        }
        const genres = record.genres;
        delete record.genres;
        delete record.band;
        const newRecord = await Record.update(req.params.id, record);
        console.log(record);
        await Genre.detachAllFromRecord(newRecord.id);
        for(let genre of genres){
            await Genre.attachToRecord(newRecord.id, genre);
        }
        return res.status(200).json({newRecord});
    }catch(err){
        console.log(err);
        return next(err);
    }
})

router.delete(':id', ensureAdmin, async function(req,res,next){
    try{
        const result = await Record.deleteRecord(req.params.id);
        return res.json(result);
    }catch(err){
        return next(err);
    }
})

router.post('/:id/:username', ensureSameUser, async function(req,res,next){
    try{
        const result = await Review.addReview({username:req.params.username,record_id:req.params.id,...req.body});
        return res.status(201).json(result);
    }catch(err){
        return next(err);
    }
})

router.patch('/:id/:username', ensureSameUser, async function(req,res,next){
    try{
        const result = await Review.updateReview(req.params.id, req.params.username, req.body);
        return res.json(result);
    }catch(err){
        return next(err);
    }
})

router.delete('/:id/:username', ensureSameUser, async function(req,res,next){
    try{
        const result = await Review.deleteReview(req.params.id);
        return res.json(result);
    }catch(err){
        return next(err);
    }
})

router.get('/:id/reviews', async function(req,res,next){
    try{
        const result = await Review.getReviews(req.params.id);
        return res.json(result);
    }catch(err){
        return next(err);
    }
})

router.post('/:id/add', upload.single('image'), async function(req,res,next){
    try{
        const id = req.params.id;
        const listing = req.body;
        listing = {...listing, record_id: id};
        if(req.file){
            listing={...listing, imageURL: req.file.path};
        }
        const result = Listing.addListing(listing);
        return result;
    }catch(err){
        return next(err);
    }
})

module.exports = router;