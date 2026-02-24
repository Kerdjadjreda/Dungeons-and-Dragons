const pool = require("../SERVICES/dbPool");

const userDataMapper = {

    async createOne({ email, username, hashedPassword }) {
        const sqlQuery = `INSERT INTO users (email, username, password) 
                          VALUES ($1, $2, $3)
                          RETURNING id, username;`;
        
        const values = [email, username, hashedPassword];
        const result = await pool.query(sqlQuery, values);

        return result.rows[0];

    },

    async findByUsername(username){

        const sqlQuery = `SELECT id, username, password FROM users
                          WHERE username=$1;`;
        const values = [username];
        const result = await pool.query(sqlQuery, values);
        return result.rows[0];
    },

    async findById(userId){
        const sqlQuery = `SELECT id, username, email FROM users
                          WHERE id=$1;`;
        const values =[userId];
        const result = await pool.query(sqlQuery, values);
        return result.rows[0];

    }
    

};

module.exports = userDataMapper;