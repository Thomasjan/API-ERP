const mssql = require('mssql');
const config = require('./config');

const DISPLAY = `
    USR_NAME AS [code],
    ISNULL(USR_DORT, 0) AS [sommeil]
`;

const FILTER = 'USR_DORT = 0 OR USR_DORT IS NULL';

class Utilisateurs {
    async getAll() {
        const pool = await mssql.connect(config);
        const sql = `SELECT ${DISPLAY} FROM USERS WHERE ${FILTER} ORDER BY USR_NAME`;
        const res = await pool.request().query(sql);
        return res.recordset;
    }

    async getCount() {
        const pool = await mssql.connect(config);
        const sql = `SELECT COUNT(*) AS [nombre] FROM USERS WHERE ${FILTER}`;
        const res = await pool.request().query(sql);
        return res.recordset;
    }

    async getOne(code) {
        const pool = await mssql.connect(config);
        const sql = `SELECT ${DISPLAY} FROM USERS WHERE USR_NAME = @code`;
        const res = await pool.request()
            .input('code', mssql.VarChar(20), code)
            .query(sql);
        return res.recordset;
    }

    async getTop(top) {
        if (!Number.isInteger(Number(top))) throw `Valeur du paramètre "top" invalide : ${top}`;
        const pool = await mssql.connect(config);
        const sql = `SELECT TOP ${top} ${DISPLAY} FROM USERS WHERE ${FILTER} ORDER BY USR_NAME`;
        const res = await pool.request().query(sql);
        return res.recordset;
    }
}

module.exports = new Utilisateurs();