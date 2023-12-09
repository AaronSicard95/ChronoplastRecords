const db = require("../db");
const { sqlForPatrialUpdate } = require("../helpers/sql");

class Record{

    //Make a new Record
    static async makeRecord(record){
        try{
            const result = await db.query(
                `INSERT INTO records
                (title, band_id, imageURL)
                VALUES
                ($1, $2, $3)
                RETURNING id, title, band_id, imageURL`,
                [record.title, record.band_id, record.imageURL]
            );
            const newRecord = result.rows[0];
            return newRecord;
        }catch(err){
            return err;
        }
    }

    //Find a record by ID
    static async findRecord(id){
        try{
            console.log(id);
            /*const result = await db.query(
                `SELECT r.id, r.band_id, r.title, r.imageURL, AVG(v.rating)::NUMERIC(10,1) AS rating
                FROM records r
                JOIN reviews v ON v.record_id = r.id
                WHERE r.id = $1
                GROUP BY r.id`,
                [id]
            );*/
            const result = await db.query(
                `SELECT r.id, r.band_id, r.title, r.imageURL, v.rating
                FROM records r
                LEFT JOIN (SELECT record_id, AVG(rating)::NUMERIC(10,1) as rating
                            FROM reviews 
                            WHERE record_id = $1
                            GROUP BY record_id) v
                            ON v.record_id = r.id
                WHERE r.id = $1`,
                [id]
            );
            console.log(result);
            let record = result.rows[0];
            const bandQuery = await db.query(
                `SELECT id, name, bio, origin, imageURL
                FROM bands
                WHERE id = $1`,
                [record.band_id]
            );
            record = {...record, band: bandQuery.rows[0]};
            const res = await db.query(
                `SELECT g.name, g.id
                FROM genres g
                JOIN genrerecords r ON r.genre_id=g.id
                WHERE r.record_id = $1`,
                [id]
            );
            record.genres = res.rows;
            return record;
        }catch(err){
            console.log(err);
            return err;
        }
    }

    //Get all records
    static async findAll(query){
        try{
            let vals=Object.values(query);
            vals = vals.map(v=>`%${v}%`)
            let keys=Object.keys(query);
            let wherePhrase = ""
            let i = 1;
            for(let key of keys){
                if(i === 1){
                    wherePhrase = "WHERE ";
                }else{
                    wherePhrase = `${wherePhrase} AND `;
                }
                wherePhrase = `${wherePhrase} ${key} ILIKE $${i}`;
                i++;
            }
            const result = await db.query(
                `SELECT r.id, r.band_id, r.title, r.imageURL, v.rating, b.name AS bandname
                FROM records r
                JOIN bands b ON b.id=r.band_id
                LEFT JOIN (SELECT record_id, AVG(rating)::NUMERIC(10,1) as rating
                            FROM reviews
                            GROUP BY record_id) v
                            ON v.record_id = r.id
                ${wherePhrase}`,
                vals
            );
            console.log(result);
            const records = result.rows;
            if(!records) records = [];
            return records;
        }catch(err){
            console.log(err);
            return err;
        }
    }

    static async update(id, data){
        const helper = sqlForPatrialUpdate(data);
        console.log(sqlForPatrialUpdate(data));
        const idIndex = helper.vals.length+1;
        console.log(`UPDATE records
        SET ${helper.statement}
        WHERE id = $${idIndex}
        RETURNING id, title, imageURL, band_id`)
        const result = await db.query(
            `UPDATE records
            SET ${helper.statement}
            WHERE id = $${idIndex}
            RETURNING id, title, imageURL, band_id`,
            [...helper.vals,id]
        );
        const res = await db.query(
            `SELECT g.name, g.id
            FROM genres g
            JOIN genrerecords r ON r.genre_id=g.id
            WHERE r.record_id = $1`,
            [id]
        );
        let record =  result.rows[0];
        record.genres = res.rows;
        return record;
    }

    static async deleteRecord(id){
        try{
            const result = await db.query(
                `DELETE FROM records
                WHERE id = $1`,
                [id]
            );
            return "deleted"
        }catch(err){
            return err;
        }
    }
}

module.exports=Record;