const mssql = require('mssql')
const config = require('./config')


const FILTER = 'ACT_DORT = 0 OR ACT_DORT IS NULL'

class Actions {
    async getAll(req, res) {
        console.log(`Actions.getAll()`.yellow);
        try {
            // let sql = `SELECT ${DISPLAY} FROM ACTIONS WHERE ${FILTER} ORDER BY AFF_CODE`;
            //40 first actions
            let sql = `SELECT * FROM ACTIONS ORDER BY ACT_DTMAJ DESC OFFSET 0 ROWS FETCH NEXT 40 ROWS ONLY`;
    
    
            // Check if there are query parameters
            const queryParams = req.query;

            if (Object.keys(queryParams).length > 0) {
                console.log('Query parameters found: ', queryParams);
                // Construct the WHERE clause based on query parameters
                const whereConditions = Object.entries(queryParams)
                    .map(([key, value]) => `${key}='${value}'`)
                    .join(' AND ');
    
                sql = `SELECT * FROM ACTIONS WHERE ${whereConditions} ORDER BY ACT_DTMAJ DESC OFFSET 0 ROWS FETCH NEXT 40 ROWS ONLY`;
                // sql = `SELECT ${DISPLAY} FROM AFFAIRES WHERE ${FILTER} AND ${whereConditions} ORDER BY AFF_CODE`;
            }
            
            const pool = await mssql.connect(config);
            const result = await pool.request().query(sql);
    
            res.json({
                count: result.recordset.length,
                actions: result.recordset
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ Erreur: error.toString() });
        }
    }

    
}

module.exports = new Actions()