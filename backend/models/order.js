const db = require("../db");

class Order{
    
    //Make order
    static async makeOrder(id, username){
        try{
            const result = await db.query(
            `INSERT INTO orders
            (record_id, username)
            VALUES ($1, $2)
            RETURNING id, record_id, username`,
            [id, username]
            )
            return result.rows[0];
        }catch(err){
            return err;
        }
    }

    //Get orders
    static async getOrders(username){
        try{
            const wherePhrase = !username?"":"WHERE username = $1";
            /*const result = await db.query(
                `SELECT r.title r.price r.id
                FROM orders
                INNER JOIN records r ON r.id = order.record_id
                ${wherePhrase}`,
                [username]
            )*/
            const result = await db.query(
                `SELECT r.id, r.title
                FROM orders o
                JOIN records r ON r.id = o.record_id
                ${wherePhrase}`,
                [username]
            )
            return result.rows;
        }catch(err){
            return err;
        }
    }
}

module.exports = Order;