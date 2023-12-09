const db = require("../db");
const { sqlForPatrialUpdate } = require("../helpers/sql");

class Review{
    static async addReview(info){
        try{
            const result = await db.query(
                `INSERT INTO reviews
                (username, record_id, rating, text)
                VALUES ($1, $2, $3, $4)
                RETURNING username, record_id, rating, text`,
                [info.username, info.record_id, info.rating, info.text]
            );
            return result.rows[0]
        }catch(err){
            return err;
        }
    }

    static async getReviews(id=null){
        try{
            const result = id?
            await db.query(`
            SELECT r.username, c.title, r.rating, r.text
            FROM reviews r
            JOIN records c ON c.id=r.record_id
            WHERE r.record_id = $1`,
            [id]):
            await db.query(`
            SELECT r.username, c.title, r.rating, r.text
            FROM reviews r
            JOIN records c ON c.id=r.record_id`);
            return result.rows;
        }catch(err){
            return err;
        }
    }

    static async updateReview(id, username, data){
        try{
            const {statement, vals} = sqlForPatrialUpdate(data);
            const idIndex = vals.length+1;
            const result = await db.query(
                `UPDATE reviews
                SET ${statement}
                WHERE record_id = $${idIndex} AND username = $${idIndex+1}
                RETURNING username, record_id, text, rating`,
                [...vals, id, username]
            );
            console.log(result);
            return result.rows[0];
        }catch(err){
            console.log(err);
            return err;
        }
    }

    static async deleteReview(id){
        try{
            const result = await db.query(
                `DELETE FROM reviews
                WHERE id = $1`,
                [id]
            );
            return "deleted";
        }catch(err){
            return err;
        }
    }
}

module.exports=Review;