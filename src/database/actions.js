const mssql = require('mssql')
const config = require('./config')


const FILTER = 'ACT_DORT = 0 OR ACT_DORT IS NULL'

class Actions {
    async getAll(req, res) {
        console.log(`Actions.getAll()`.yellow);
        try {
            // Default SQL query for all fields
            let sql = `SELECT * FROM ACTIONS ORDER BY ACT_DTMAJ DESC OFFSET 0 ROWS FETCH NEXT 40 ROWS ONLY`;
    
            // Check if there are query parameters
            const queryParams = req.query;
    
            if (Object.keys(queryParams).length > 0) {
                console.log('Query parameters found: ', queryParams);
    
                // Check for the 'display' parameter
                if (queryParams.display) {
                    try {
                        // Remove single quotes and parse the display parameter into an array
                        const displayFields = JSON.parse(queryParams.display);
                
                        // Check if displayFields is an array
                        if (Array.isArray(displayFields)) {
                
                            // Construct the SELECT clause with the specified fields
                            const selectClause = displayFields.join(', ');
                
                            // Update the SQL query
                            sql = `SELECT ${selectClause} FROM ACTIONS ORDER BY ACT_DTMAJ DESC OFFSET 0 ROWS FETCH NEXT 40 ROWS ONLY`;
                        } else {
                            console.error('Invalid display parameter format. Expected an array.');
                            res.status(400).json({ Error: 'Invalid display parameter format. Expected an array.' });
                            return;
                        }
                    } catch (parseError) {
                        console.error('Error parsing display parameter:', parseError);
                        res.status(400).json({ Error: 'Invalid display parameter format.' });
                        return;
                    }
                }
    
                // Construct the WHERE clause based on other query parameters if needed
                const whereConditions = Object.entries(queryParams)
                    .filter(([key]) => key !== 'display') // Exclude 'display' from where conditions
                    .map(([key, value]) => `${key}='${value}'`)
                    .join(' AND ');
    
                if (whereConditions) {
                    sql = `SELECT * FROM ACTIONS WHERE ${whereConditions} ORDER BY ACT_DTMAJ DESC OFFSET 0 ROWS FETCH NEXT 40 ROWS ONLY`;
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