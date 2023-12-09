const express = require("express");
const cors = require("cors");
const { verifyJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const recordsRoutes = require('./routes/records')
const userRoutes = require("./routes/users");
const bandRoutes = require('./routes/bands');
const genreRoutes = require('./routes/genres');
const { NotFoundError } = require("./expressError");

const app = express();

const morgan = require('morgan');

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(verifyJWT);

app.use("/images", express.static('images'));
app.use("/auth", authRoutes);
app.use('/records', recordsRoutes);
app.use('/users', userRoutes);
app.use('/bands', bandRoutes);
app.use('/genres', genreRoutes);

app.use(function(req,res,next){
    return next(new NotFoundError());
})

app.use(function(err,req,res,next){
    const status = err.status||500;
    const message = err.message;
    console.log(err);
    return res.status(status).json({
        error: {message, status},
    })
})

module.exports = app;