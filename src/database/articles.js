const mssql = require('mssql');
const config = require('./config');

const DISPLAY = `
    ART_CODE AS [code],
    ART_LIBC AS [libelle],
    FAR_CODE AS [famille],
    SFA_CODE AS [sous-famille],
    ISNULL(ART_DORT, 0) AS [sommeil]
`;

const FILTER = 'ART_DORT = 0 OR ART_DORT IS NULL';

const ART_CODE_SIZE = 30;

class Articles {
    async getAll() {
        const pool = await mssql.connect(config);
        const sql = `SELECT ${DISPLAY} FROM ARTICLES WHERE ${FILTER} ORDER BY ART_CODE`;
        const res = await pool.request().query(sql);
        return res.recordset;
    }

    async getCount() {
        const pool = await mssql.connect(config);
        const sql = `SELECT COUNT(*) AS [nombre] FROM ARTICLES WHERE ${FILTER}`;
        const res = await pool.request().query(sql);
        return res.recordset;
    }

    async getOne(code) {
        const pool = await mssql.connect(config);
        const sql = `SELECT ${DISPLAY} FROM ARTICLES WHERE ART_CODE = @code`;
        const res = await pool.request()
            .input('code', mssql.VarChar(ART_CODE_SIZE), code)
            .query(sql);
        return res.recordset;
    }

    async getTop(top) {
        if (!Number.isInteger(Number(top))) throw `Valeur du paramètre "top" invalide : ${top}`;
        const pool = await mssql.connect(config);
        const sql = `SELECT TOP ${top} ${DISPLAY} FROM ARTICLES WHERE ${FILTER} ORDER BY ART_CODE`;
        const res = await pool.request().query(sql);
        return res.recordset;
    }
}

module.exports = new Articles();