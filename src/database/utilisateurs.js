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
        const sql = `SELECT ${DISPLAY} FROM USERS WHERE USR_NAME = @code`
        const res = await pool.request()
            .input('code', mssql.VarChar(USR_NAME_SIZE), code)
            .query(sql)
        return {
            found: res.recordset.length > 0,
            utilisateur: res.recordset.length > 0 ? res.recordset[0] : null
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
                    WHERE CONTACTS.CCT_ORIGIN = TIERS.PCF_CODE AND TIERS.PCF_TYPE ='C'
                    ORDER BY CCT_NOM, CASE WHEN TIERS.PCF_TYPE = 'C' THEN 1 ELSE 2 END`
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
                    AND TIERS.PCF_TYPE ='C'
                    ORDER BY CCT_NOM `
        const res = await pool.request().query(sql)
        return {
            count: res.recordset.length,
            users: res.recordset
        }
    }
}

module.exports = new Utilisateurs()
