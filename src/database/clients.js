const mssql = require('mssql')
const config = require('./config')

const DISPLAY = `
    PCF_CODE,
    PCF_RS,
    PCF_RUE,
    PCF_CP,
    PCF_VILLE,
    FAT_CODE,
    SFT_CODE,
    ISNULL(XXX_VERBUI, '') AS version_erp,
    ISNULL(XXX_EA09, '') AS version_ws,
    ISNULL(PCF_DORT, 0) AS sommeil
`
// TODO: ajouter les colonnes suivantes en parametre de requete (G-Ticket)



// const DISPLAY = `
//     PCF_CODE AS code,
//     PCF_RS AS raison_sociale,
//     PCF_RUE AS adresse,
//     PCF_CP AS code_postal,
//     PCF_VILLE AS ville,
//     FAT_CODE AS famille,
//     SFT_CODE AS sous_famille,
//     ISNULL(XXX_VERBUI, '') AS version_erp,
//     ISNULL(XXX_EA09, '') AS version_ws,
//     ISNULL(PCF_DORT, 0) AS sommeil
// `

const FILTER = 'PCF_DORT = 0 OR PCF_DORT IS NULL'

const PCF_CODE_SIZE = 20

class Clients {
    async getAll(req, res) {
        console.log(`Tiers.getAll()`.yellow);
        const displayFields = req.displayFields || '*';

        try {
            // Default SQL query for all fields
            let sql = `SELECT ${displayFields} FROM TIERS ORDER BY PCF_DTMAJ DESC`;
    
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
                    sql = `SELECT ${displayFields} FROM TIERS WHERE ${whereConditions} ORDER BY PCF_DTMAJ DESC`;
                }
            }
            
            const pool = await mssql.connect(config);
            const result = await pool.request().query(sql);
    
            res.json({
                count: result.recordset.length,
                clients: result.recordset
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ Erreur: error.toString() });
        }
    }

    async getCount() {
        const pool = await mssql.connect(config)
        const sql = `SELECT COUNT(*) as [nombre] FROM TIERS WHERE ${FILTER}`
        const res = await pool.request().query(sql)
        return res.recordset.length > 0 ? res.recordset[0].nombre : 0
    }

    async getOne(code) {
        const pool = await mssql.connect(config)
        const sql = `SELECT ${DISPLAY} FROM TIERS WHERE PCF_CODE = @code`
        const res = await pool.request()
            .input('code', mssql.VarChar(PCF_CODE_SIZE), code)
            .query(sql)
        return {
            found: res.recordset.length > 0,
            client: res.recordset.length > 0 ? res.recordset[0] : null
        }
    }

    async update(req, res) {
        console.log(`Tiers.update()`.yellow);
        const id = req.params.id;
        const data = req.body;
        console.log(data);
    
        try {
            const pool = await mssql.connect(config);
    
            // Construct SET clause dynamically
            const setClause = Object.keys(data)
                .map(key => `${key} = @${key}`)
                .join(', ');
    
            const sql = `UPDATE TIERS SET ${setClause} WHERE PCF_CODE = @id`;
    
            // Create input parameters for each key in the data object
            const request = pool.request();
            Object.keys(data).forEach(key => {
                request.input(key, mssql.NVarChar, data[key]);
            });
            request.input('id', mssql.NVarChar, id);
    
            const result = await request.query(sql);
    
            res.json({
                count: result.rowsAffected[0],
                tiers: data
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ Erreur: error.toString() });
        }
    }

    async getPage(offset, count, sort, order) {
        const pool = await mssql.connect(config)

        let orderBy = (sort === 'libelle') ? 'PCF_RS' : 'PCF_CODE'
        orderBy = orderBy + ' ' + (order === 'desc' ? 'DESC' : 'ASC')

        const sql = `SELECT ${DISPLAY} FROM TIERS WHERE ${FILTER} ORDER BY ${orderBy} OFFSET ${offset} ROWS FETCH NEXT ${count} ROWS ONLY`
        const res = await pool.request().query(sql)

        const sql2 = `SELECT COUNT(*) as [nombre] FROM TIERS WHERE ${FILTER}`
        const res2 = await pool.request().query(sql2)

        return {
            clients: res.recordset,
            total_count: res2.recordset.length > 0 ? res2.recordset[0].nombre : 0
        }
    }

    async getTop(top) {
        if (!Number.isInteger(Number(top))) throw `Valeur du paramètre "top" invalide : ${top}`
        const pool = await mssql.connect(config)
        const sql = `SELECT TOP ${top} ${DISPLAY} FROM TIERS WHERE ${FILTER} ORDER BY PCF_CODE`
        const res = await pool.request().query(sql)
        return {
            count: res.recordset.length,
            clients: res.recordset
        }
    }

    async getGestimumClients() {
        const pool = await mssql.connect(config)
        const sql = `
            SELECT PCF_CODE, PCF_RS, PCF_EMAIL, PCF_RUE, PCF_CP, PCF_VILLE, PAY_CODE, PCF_TYPE
            FROM TIERS
            ORDER BY PCF_RS, PCF_TYPE
        `
        const res = await pool.request().query(sql)
        return {
            count: res.recordset.length,
            clients: res.recordset
        }
    }
  
  async getGestimumClientsQuery(query) {
        const pool = await mssql.connect(config)
        const sql = `SELECT PCF_CODE, PCF_RS, PCF_EMAIL, PCF_RUE, PCF_CP, PCF_VILLE, PAY_CODE, PCF_TYPE  
                    FROM TIERS
                    WHERE PCF_RS LIKE '%${query}%' OR PCF_CODE LIKE '%${query}%' OR PCF_EMAIL LIKE '%${query}%'
                    ORDER BY PCF_RS, PCF_TYPE`;

        const res = await pool.request().query(sql)
        return {
            count: res.recordset.length,
            clients: res.recordset
        }
    }

}

module.exports = new Clients()
