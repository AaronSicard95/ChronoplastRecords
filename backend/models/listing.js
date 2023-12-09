const db = require("../db");

class Listing{

    static async addListing(listing){
        try{
            const result = await db.query(`
            INSERT INTO lsitings
            (quality, price, stock, record_id)
            VALUES($1,$2,$3,$4)
            RETURNING id, quality, price, stock, record_id`,
            [listing.quality, listing.price,listing.stock,listing.record_id]);
            return result;
        }catch(err){
            return err;
        }
    }

    static async getRelatedListings(record_id){
        try{
            const result = await db.query(`
            SELECT id, quality, price, stock, imageURL
            FROM listings
            WHERE record_id=$1`,
            [record_id]);
            return result;
        }catch(err){
            return err;
        }
    }

    static async getAllListings(){
        try{
            const result = await db.query(`
            SELECT l.id, l.quality, l.price, l.stock, l.imageURL, l.record_id, r.name AS record
            FROM listings l
            JOIN records r ON r.id=l.record_id`);
            return result;
        }catch(err){
            return err;
        }
    }
}

module.exports=Listing;