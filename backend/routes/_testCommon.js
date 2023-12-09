const db = require("../db");
const User = require("../models/user");
const {createToken} = require("../helpers/tokens");
const { SECRET_KEY } = require("../config");

async function commonBeforeAll(){
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM records");

    await User.create({
        username: "U1",
        handle: "first User",
        password: "password1",
        email: "firstUser@user.com",
        first_name: "first",
        last_name: "user"
    })
    await User.create({
        username: "U2",
        handle: "second User",
        password: "passwordw",
        email: "secondUser@user.com",
        first_name: "second",
        last_name: "user"
    })
    await User.create({
        username: "U3",
        handle: "third User",
        password: "password3",
        email: "thirdUser@user.com",
        first_name: "third",
        last_name: "user"
    })
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}
 
const u1Token = createToken({username: "U1", isAdmin: false}, SECRET_KEY);
const adminToken = createToken({username: "admin", isAdmin: true}, SECRET_KEY);

module.exports={
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    adminToken
}