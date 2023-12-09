const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../expressError");
const {SECRET_KEY} = require("../config");


function verifyJWT(req, res, next){
    try{
        const token =  req.headers && req.headers.authorization;
        if(token){
            res.locals.user = jwt.verify(token, SECRET_KEY);
        }
        return next();
    } catch(err){
        return next();
    }
}

function checkLoggedIn(req, res, next){
    try{
        if(!res.locals.user) throw new UnauthorizedError("You must be signed in");
        return next();
    }catch(err){
        return next(err);
    }
}

function ensureAdmin(req,res,next){
    try{
        console.log(res.locals.user);
        if(!res.locals.user||!res.locals.user.isadmin) throw new UnauthorizedError("Must Be Logged In As Admin");
        return next();
    }catch(err){
        console.log(err);
        return next(err);
    }
}

function adminOrSameUser(req,res,next){
    try{
        if(res.locals.user.username != req.params.username&&!res.locals.isAdmin) throw new UnauthorizedError("Must be admin or selected user");
        return next();
    }catch(err){
        return next(err);
    }
}

function ensureSameUser(req,res,next){
    try{
        if(res.locals.user.username == req.params.username)return next();
        throw new UnauthorizedError("Must post as yourself");
    }catch(err){
        return next(err);
    }
}

module.exports = {
    verifyJWT,
    checkLoggedIn,
    ensureAdmin,
    adminOrSameUser,
    ensureSameUser
}