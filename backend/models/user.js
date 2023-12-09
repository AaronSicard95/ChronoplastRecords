const db=require("../db");
const bcrypt = require("bcrypt");

const {BCRYPT_WORK_FACTOR} = require("../config");
const { BadRequestError, UnauthorizedError, NotFoundError } = require("../expressError");
const Order = require("./order");

class User{

    //Get user by username
    static async get(username){
        try{
            const getUser = await db.query(
                `SELECT username, handle
                FROM users
                WHERE username = $1`,
                [username]
            )
            const AUser = getUser.rows[0];
            if(!AUser){
                throw new NotFoundError("No such user exists");
            }
            const orders = await Order.getOrders(AUser.username);
            AUser.orders = orders;
            return AUser;
        }catch(err){
            console.log(err);
            return (err);
        }
    }

    static async findAll(){
        const results = await db.query(
            `SELECT username, handle, isAdmin, email
            FROM users`
        )
        const users = results.rows;
        return users;
    }

    //creates a new User
    static async create(user){
        const dupeCheck = await db.query(
            `SELECT username
            FROM users
            WHERE username = $1`,
            [user.username]
        );

        if(dupeCheck.rows[0]){
            throw new BadRequestError(`Username: ${user.username} already taken`);
        }

        const bPassword = await bcrypt.hash(user.password, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `INSERT INTO users
            (username, password, handle, email, isAdmin)
            VALUES ($1, $2, $3, $4, FALSE)
            RETURNING username, handle, email, isAdmin`,
            [user.username, bPassword, user.handle, user.email]
        )

        const newUser = result.rows[0];

        return newUser;
    }

    //Creates a new admin user if request is from an admin
    static async createAdmin(user, admin){
        const dupeCheck = await db.query(
            `SELECT username
            FROM users
            WHERE username = $1`,
            [user.username]
        );

        if(dupeCheck.rows[0]){
            throw new BadRequestError(`Username: ${user.username} already taken`);
        }

        const adminCheck = await db.query(
            `SELECT username, password, isAdmin
            FROM users
            WHERE username = $1`,
            [admin.username]
        )

        const getAd = adminCheck.rows[0];

        //const isAuthorized = await bcrypt.compare(admin.password, getAd.password);

        /*if(!isAuthorized || !getAd.isAdmin){
            throw new UnauthorizedError(`Only Admins can create Admin Accounts`);
        }*/

        const bPassword = await bcrypt.hash(user.password, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `INSERT INTO users
            (username, password, handle, email, isAdmin)
            VALUES ($1, $4, $5, $6, TRUE)
            RETURNING username, handle, email, isAdmin`,
            [user.username, bPassword, user.handle, user.email]
        )

        const newUser = result.rows[0];
        return newUser;
    }

    static async login(user){
        try{
            console.log(user);
                const result = await db.query(
                `SELECT username, password, isAdmin
                FROM users
                WHERE username = $1`,
                [user.username]
            )
            const userCheck = result.rows[0];
            if(!bcrypt.compare(user.password, userCheck.password)) throw new BadRequestError("username/password do not match");
            return {username: userCheck.username, isadmin: userCheck.isadmin};
        }catch(err){
            return err;
        }
    }
}

module.exports= User;