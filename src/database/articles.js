const mssql = require('mssql')
const config = require('./config')

const DISPLAY = `
    ART_CODE AS [code],
    ART_LIBC AS [libelle],
    FAR_CODE AS [famille],
    SFA_CODE AS [sous-famille],
    ISNULL(ART_DORT, 0) AS [sommeil]
`

const FILTER = 'ART_DORT = 0 OR ART_DORT IS NULL'

const ART_CODE_SIZE = 30

class Articles {
    async getAll() {
        const pool = await mssql.connect(config)
        const sql = `SELECT ${DISPLAY} FROM ARTICLES WHERE ${FILTER} ORDER BY ART_CODE`
        const res = await pool.request().query(sql)
        return {
            count: res.recordset.length,
            articles: res.recordset
        }
    }

    async getCount() {
        const pool = await mssql.connect(config)
        const sql = `SELECT COUNT(*) AS [nombre] FROM ARTICLES WHERE ${FILTER}`
        const res = await pool.request().query(sql)
        return res.recordset.length > 0 ? res.recordset[0].nombre : 0
    }

    async getOne(code) {
        const pool = await mssql.connect(config)
        const sql = `SELECT ${DISPLAY} FROM ARTICLES WHERE ART_CODE = @code`
        const res = await pool.request()
            .input('code', mssql.VarChar(ART_CODE_SIZE), code)
            .query(sql)
        return {
            found: res.recordset.length > 0,
            article: res.recordset.length > 0 ? res.recordset[0] : null
        }
    }

    async getPage(offset, count, sort, order) {
        const pool = await mssql.connect(config)

        let orderBy = (sort === 'libelle') ? 'ART_LIBC' : 'ART_CODE'
        orderBy = orderBy + ' ' + (order === 'desc' ? 'DESC' : 'ASC')

        const sql = `SELECT ${DISPLAY} FROM ARTICLES WHERE ${FILTER} ORDER BY ${orderBy} OFFSET ${offset} ROWS FETCH NEXT ${count} ROWS ONLY`
        const res = await pool.request().query(sql)

        const sql2 = `SELECT COUNT(*) as [nombre] FROM ARTICLES WHERE ${FILTER}`
        const res2 = await pool.request().query(sql2)

        return {
            articles: res.recordset,
            total_count: res2.recordset.length > 0 ? res2.recordset[0].nombre : 0
        }
    }

    async getTop(top) {
        if (!Number.isInteger(Number(top))) throw `Valeur du paramètre "top" invalide : ${top}`
        const pool = await mssql.connect(config)
        const sql = `SELECT TOP ${top} ${DISPLAY} FROM ARTICLES WHERE ${FILTER} ORDER BY ART_CODE`
        const res = await pool.request().query(sql)
        return {
            count: res.recordset.length,
            articles: res.recordset
        }
    }
}

module.exports = new Articles()