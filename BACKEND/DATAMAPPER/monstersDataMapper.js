const pool = require("../SERVICES/dbPool");


const monstersDataMapper = {

    async findAll(){
        const result = await pool.query(`SELECT * FROM monster_templates ORDER BY monster_name ASC;`);
        return result.rows;
    },

    async findByPk(monsterId){
        const result = await pool.query(`SELECT * FROM monster_templates WHERE id =$1`, [monsterId]);
        return result.rows[0];

    }
}

module.exports = monstersDataMapper;