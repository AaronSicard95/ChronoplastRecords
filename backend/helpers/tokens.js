const jwt = require("jsonwebtoken");
const {SECRET_KEY} = require("../config");

function createToken(user){
    let token = {
        username: user.username,
        isadmin: user.isadmin || false
    };

    return jwt.sign(token, SECRET_KEY);
}

module.exports ={
    createToken
};