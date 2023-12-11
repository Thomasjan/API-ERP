const mssql = require('mssql')
const config = require('./config')


const FILTER = 'ACT_DORT = 0 OR ACT_DORT IS NULL'

class Actions {
    async getAll(req, res) {
        console.log(`Actions.getAll()`.yellow);
        const displayFields = req.displayFields || '*';

        try {
            // Default SQL query for all fields
            let sql = `SELECT ${displayFields} FROM ACTIONS ORDER BY ACT_DTMAJ DESC `;
    
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
                    sql = `SELECT ${displayFields} FROM ACTIONS WHERE ${whereConditions} ORDER BY ACT_DTMAJ DESC `;
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

   

    async updateAction(req, res) {
        console.log(`Actions.updateAction()`.yellow);
        const id = req.params.id;
        const data = req.body;
        console.log(data);
    
        try {
            const pool = await mssql.connect(config);
    
            // Construct SET clause dynamically
            const setClause = Object.keys(data)
                .map(key => `${key} = @${key}`)
                .join(', ');
    
            const sql = `UPDATE ACTIONS SET ${setClause} WHERE ACT_NUMERO = @id`;
    
            // Create input parameters for each key in the data object
            const request = pool.request();
            Object.keys(data).forEach(key => {
                request.input(key, mssql.NVarChar, data[key]);
            });
            request.input('id', mssql.NVarChar, id);
    
            const result = await request.query(sql);
    
            res.json({
                count: result.rowsAffected[0],
                action: data
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ Erreur: error.toString() });
        }
    }
    
    
}

module.exports = new Actions()