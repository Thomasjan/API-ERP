const mssql = require('mssql')
const config = require('./config')


const FILTER = 'ACT_DORT = 0 OR ACT_DORT IS NULL'

class Actions {
    async getAll(req, res) {
        console.log(`Actions.getAll()`.yellow);
        const displayFields = req.displayFields || '*';

        try {
            // Default SQL query for all fields
            let sql = `SELECT ${displayFields} FROM ACTIONS ORDER BY ACT_DTMAJ DESC OFFSET 0 ROWS FETCH NEXT 40 ROWS ONLY`;
    
            // Check if there are query parameters
            const queryParams = req.query;
    
            if (Object.keys(queryParams).length > 0) {
                console.log('Query parameters found: ', queryParams);
    
                // Construct the WHERE clause based on other query parameters if needed
                const whereConditions = Object.entries(queryParams)
                    .filter(([key]) => key !== 'display') // Exclude 'display' from where conditions
                    .map(([key, value]) => `${key}='${value}'`)
                    .join(' AND ');
    
                if (whereConditions) {
                    sql = `SELECT ${displayFields} FROM ACTIONS WHERE ${whereConditions} ORDER BY ACT_DTMAJ DESC OFFSET 0 ROWS FETCH NEXT 40 ROWS ONLY`;
                }
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