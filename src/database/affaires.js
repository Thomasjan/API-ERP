const mssql = require('mssql')
const config = require('./config')


const DISPLAY = `
    AFF_CODE AS [code],
    AFF_LIB AS [libelle],
    AFF_ETAT AS [etat],
    AFF_GROUP1 AS [group1],
    AFF_GROUP2 AS [group2],
    AFF_DT_DEB AS [dt_deb],
    AFF_DT_FIN AS [dt_fin],
    PCF_CODE AS [pcf_code],
    AFF_DESC AS [desc],
    AFF_BUGLAC AS [buglac],
    AFF_TO_REC AS [to_rec],
    AFF_DORT AS [dort],
    ANA_CODE AS [ana_code],
    AFF_DTCRE AS [dtcre],
    AFF_USRCRE AS [usrcre],
    AFF_DTMAJ AS [dtmaj],
    AFF_USRMAJ AS [usrmaj],
    AFF_NUMMAJ AS [nummaj]
`;

const FILTER = '(AFF_DORT = 0 OR AFF_DORT IS NULL)'
    

class Affaires {
    async getAll(req, res) {
        console.log(`Affaires.getAll()`.yellow);
        try {
            let sql = `SELECT ${DISPLAY} FROM AFFAIRES WHERE ${FILTER} ORDER BY AFF_CODE`;
    
            // Check if there are query parameters
            const queryParams = req.query;

            if (Object.keys(queryParams).length > 0) {
                console.log('Query parameters found: ', queryParams);
                // Construct the WHERE clause based on query parameters
                const whereConditions = Object.entries(queryParams)
                    .map(([key, value]) => `${key}='${value}'`)
                    .join(' AND ');
    
                sql = `SELECT ${DISPLAY} FROM AFFAIRES WHERE ${FILTER} AND ${whereConditions} ORDER BY AFF_CODE`;
            }
            
            const pool = await mssql.connect(config);
            const result = await pool.request().query(sql);
    
            res.json({
                count: result.recordset.length,
                affaires: result.recordset
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ Erreur: error.toString() });
        }
    }

    
}

module.exports = new Affaires()