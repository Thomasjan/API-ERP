const mssql = require('mssql')
const config = require('./config')

const DISPLAY = `
    PCF_CODE AS code,
    PCF_RS AS raison_sociale,
    FAT_CODE AS famille,
    SFT_CODE AS sous_famille,
    ISNULL(XXX_VERBUI, '') AS version_erp,
    ISNULL(XXX_EA09, '') AS version_ws,
    ISNULL(PCF_DORT, 0) AS sommeil
`

const FILTER = 'PCF_DORT = 0 OR PCF_DORT IS NULL'

const PCF_CODE_SIZE = 20

class Clients {
    async getAll() {
        const pool = await mssql.connect(config)
        const sql = `SELECT ${DISPLAY} FROM TIERS WHERE ${FILTER} ORDER BY PCF_CODE`
        const res = await pool.request().query(sql)
        return {
            count: res.recordset.length,
            clients: res.recordset
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
        const sql = `SELECT PCF_CODE, PCF_RS, PCF_EMAIL, PCF_RUE, PCF_CP, PCF_VILLE, PAY_CODE, PCF_TYPE  
                    FROM TIERS
                    ORDER BY PCF_RS, PCF_TYPE`
        const res = await pool.request().query(sql)
        return {
            count: res.recordset.length,
            clients: res.recordset
        }
    }
}

module.exports = new Clients()
