const mssql = require('mssql');
const config = require('./config');

const DISPLAY = `
    PCF_CODE AS [code],
    PCF_RS AS [raison-sociale],
    FAT_CODE AS [famille],
    SFT_CODE AS [sous-famille],
    ISNULL(XXX_VERBUI, '') AS [version-erp],
    ISNULL(XXX_EA09, '') AS [version-ws],
    ISNULL(PCF_DORT, 0) AS [sommeil]
`;

const FILTER = 'PCF_DORT = 0 OR PCF_DORT IS NULL';

const PCF_CODE_SIZE = 20;

class Clients {
    async getAll() {
        const pool = await mssql.connect(config);
        const sql = `SELECT ${DISPLAY} FROM TIERS WHERE ${FILTER} ORDER BY PCF_CODE`;
        const res = await pool.request().query(sql);
        return res.recordset;
    }

    async getCount() {
        const pool = await mssql.connect(config);
        const sql = `SELECT COUNT(*) as [nombre] FROM TIERS WHERE ${FILTER}`;
        const res = await pool.request().query(sql);
        return res.recordset;
    }

    async getOne(code) {
        const pool = await mssql.connect(config);
        const sql = `SELECT ${DISPLAY} FROM TIERS WHERE PCF_CODE = @code`;
        const res = await pool.request()
            .input('code', mssql.VarChar(PCF_CODE_SIZE), code)
            .query(sql);
        return res.recordset;
    }

    async getTop(top) {
        if (!Number.isInteger(Number(top))) throw `Valeur du paramètre "top" invalide : ${top}`;
        const pool = await mssql.connect(config);
        const sql = `SELECT TOP ${top} ${DISPLAY} FROM TIERS WHERE ${FILTER} ORDER BY PCF_CODE`;
        const res = await pool.request().query(sql);
        return res.recordset;
    }
}

module.exports = new Clients();