const mssql = require('mssql')
const config = require('./config')

const DISPLAY = `
    USR_NAME AS [code],
    ISNULL(USR_DORT, 0) AS [sommeil]
`
const FILTER = 'USR_DORT = 0 OR USR_DORT IS NULL'

const USR_NAME_SIZE = 20

class Utilisateurs {
    async getAll() {
        const pool = await mssql.connect(config)
        const sql = `SELECT ${DISPLAY} FROM USERS WHERE ${FILTER} ORDER BY USR_NAME`
        const res = await pool.request().query(sql)
        return {
            count: res.recordset.length,
            utilisateurs: res.recordset
        }
    }

    async getCount() {
        const pool = await mssql.connect(config)
        const sql = `SELECT COUNT(*) AS [nombre] FROM USERS WHERE ${FILTER}`
        const res = await pool.request().query(sql)
        return res.recordset.length > 0 ? res.recordset[0].nombre : 0
    }

    async getOne(code) {
        const pool = await mssql.connect(config)
        const sql = `SELECT CCT_NUMERO, CCT_CODE, CCT_PRENOM, CCT_NOM, CCT_EMAIL, CCT_TELM, CCT_ORIGIN 
                FROM CONTACTS 
                WHERE CCT_NUMERO = @code`
        const res = await pool.request()
            .input('code', mssql.VarChar(USR_NAME_SIZE), code)
            .query(sql)
        return {
            found: res.recordset.length > 0,
            utilisateur: res.recordset.length > 0 ? res.recordset[0] : null
        }
    }

    async getContacts(req, res) {
        console.log(`Contacts.getAll()`.yellow);
        const displayFields = req.displayFields || '*';

        try {
            // Default SQL query for all fields
            let sql = `SELECT ${displayFields} FROM CONTACTS ORDER BY CCT_DTMAJ DESC`;
    
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
                    sql = `SELECT ${displayFields} FROM CONTACTS WHERE ${whereConditions} ORDER BY CCT_DTMAJ DESC`;
                }
            }
            
            console.log("SQL: ", sql)
            const pool = await mssql.connect(config);
            const result = await pool.request().query(sql);
    
            res.json({
                count: result.recordset.length,
                utilisateurs: result.recordset
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ Erreur: error.toString() });
        }
    }

    async update(req, res) {
        console.log(`Contacts.update()`.yellow);
        const id = req.params.id;
        const data = req.body;
        console.log(data);
    
        try {
            const pool = await mssql.connect(config);
    
            // Construct SET clause dynamically
            const setClause = Object.keys(data)
                .map(key => `${key} = @${key}`)
                .join(', ');
    
            const sql = `UPDATE CONTACTS SET ${setClause} WHERE CCT_NUMERO = @id`;
    
            // Create input parameters for each key in the data object
            const request = pool.request();
            Object.keys(data).forEach(key => {
                request.input(key, mssql.NVarChar, data[key]);
            });
            request.input('id', mssql.NVarChar, id);
    
            const result = await request.query(sql);
    
            res.json({
                count: result.rowsAffected[0],
                utilisateur: data
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ Erreur: error.toString() });
        }
    }

    async getTop(top) {
        if (!Number.isInteger(Number(top))) throw `Valeur du paramètre "top" invalide : ${top}`
        const pool = await mssql.connect(config)
        const sql = `SELECT TOP ${top} ${DISPLAY} FROM USERS WHERE ${FILTER} ORDER BY USR_NAME`
        const res = await pool.request().query(sql)
        return {
            count: res.recordset.length,
            utilisateurs: res.recordset
        }
    }

    

    async getGestimumUsers() {
        const pool = await mssql.connect(config)
        const sql = `SELECT CCT_NUMERO, CCT_CODE, CCT_PRENOM, CCT_NOM, CCT_EMAIL, PCF_RS, CCT_ORIGIN, PCF_TYPE 
                    FROM CONTACTS, TIERS
                    WHERE CONTACTS.CCT_ORIGIN = TIERS.PCF_CODE AND TIERS.PCF_TYPE IN ('C', 'P')
                    ORDER BY CCT_NOM, CASE WHEN TIERS.PCF_TYPE = 'C' THEN 1 ELSE 2 END`;
        const res = await pool.request().query(sql)
        return {
            count: res.recordset.length,
            users: res.recordset
        }
    }

    async getGestimumUsersOfClient(code) {
        const pool = await mssql.connect(config)
        const sql = `SELECT CCT_NUMERO, CCT_CODE, CCT_PRENOM, CCT_NOM, CCT_EMAIL, PCF_RS, CCT_ORIGIN  
                    FROM CONTACTS, TIERS
                    WHERE CONTACTS.CCT_ORIGIN = TIERS.PCF_CODE
                    AND CONTACTS.CCT_ORIGIN = '${code}'
                    AND TIERS.PCF_TYPE IN ('C', 'P')
                    ORDER BY CCT_NOM `;
        const res = await pool.request().query(sql)
        return {
            count: res.recordset.length,
            users: res.recordset
        }
    }
}

module.exports = new Utilisateurs()