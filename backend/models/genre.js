const db = require("../db");

class Genre{

    //Make a genre
    static async makeGenre(genre){
        const result = await db.query(
            `INSERT INTO genre
            (name)
            VALUES ($1)
            RETURNING id, name`,
            [genre.name]
        );
        let newGenre = result.rows[0];
        return newGenre;
    }

    static async attachToBand(band_id, genre){
        try{
            let genre_id;
            const search = await db.query(`
            SELECT id, name
            FROM genres
            WHERE name ILIKE $1`,
            [genre]);
            if(!search.rows[0]){
                const newGenre = await db.query(`
                INSERT INTO genres
                (name)
                VALUES ($1)
                RETURNING id, name`,
                [genre]);
                genre_id = newGenre.rows[0].id;
            }else{
                const check = await db.query(`
                SELECT band_id, genre_id
                FROM genrebands
                WHERE band_id = $1 AND
                genre_id = $2`,
                [band_id, search.id]);
                if(check.rows[0])return "relation already exists";
                genre_id = search.rows[0].id;
            }
            const result = await db.query(
            `INSERT INTO genrebands
            (band_id, genre_id)
            VALUES ($1, $2)
            RETURNING band_id, genre_id`,
            [band_id, genre_id])
            return result.rows[0];  
        }catch(err){
            console.log(err);
            return err;
        }
    }

    static async attachToRecord(record_id, genre){
        try{
            let genre_id;
            const search = await db.query(`
            SELECT id, name
            FROM genres
            WHERE name ILIKE $1`,
            [genre]);
            if(!search.rows[0]){
                const newGenre = await db.query(`
                INSERT INTO genres
                (name)
                VALUES ($1)
                RETURNING id, name`,
                [genre]);
                genre_id = newGenre.rows[0].id;
            }else{
                const check = await db.query(`
                SELECT record_id, genre_id
                FROM genrerecords
                WHERE record_id = $1 AND
                genre_id = $2`,
                [record_id, search.id]);
                if(check.rows[0]) return "relation already exists";
                genre_id = search.rows[0].id;
            }
            const result = await db.query(
            `INSERT INTO genrerecords
            (record_id, genre_id)
            VALUES ($1, $2)
            RETURNING record_id, genre_id`,
            [record_id, genre_id])
            return result.rows[0];  
        }catch(err){
            return err;
        }
    }

    static async findAll(search = "",onlyNames = false){
        const result = await db.query(`
        SELECT id, name
        FROM genres
        WHERE name ILIKE $1`,
        [`%${search}%`]);
        let genres = result.rows;
        if(onlyNames)genres=genres.map(g=>g.name);
        return genres;
    }

    static async getRelated(id){
        try{
            const bandRes = await db.query(`
            SELECT b.name, b.id, b.bio, b.imageURL
            FROM bands b
            JOIN genrebands g ON g.band_id = b.id
            WHERE g.genre_id = $1`,
            [id]);
            const bands = bandRes.rows;
            const recordRes = await db.query(`
            SELECT r.title, r.id, r.imageURL, b.name AS bandname
            FROM records r
            JOIN genrerecords g ON g.record_id = r.id
            JOIN bands b ON b.id = r.band_id
            WHERE g.genre_id = $1`,
            [id]);
            const records = recordRes.rows;
            const nameGet = await db.query(`
            SELECT name
            FROM genres
            WHERE id = $1`,
            [id]);
            const name = nameGet.rows[0].name;
            console.log(nameGet);
            return {name, bands, records};
        }catch(err){
            return err;
        }
    }

    static async detachAllFromRecord(id){
        try{
            const result = await db.query(`
            DELETE FROM genrerecords
            WHERE record_id=$1`,
            [id]);
            return "deleted";
        }catch(err){
            return err;
        }
    }
    
    static async detachAllFromBand(id){
        try{
            const result = await db.query(`
            DELETE FROM genrebands
            WHERE band_id=$1`,
            [id]);
            return "deleted";
        }catch(err){
            return err;
        }
    }
}

module.exports = Genre;