require('dotenv').config()


const config = {
    server: process.env.SQL_SERVER || 'SQL-SRV',
    database: process.env.SQL_DATABASE || '',
    user: process.env.SQL_USER || '',
    password: process.env.SQL_PASSWORD || '',
    port: parseInt(process.env.SQL_PORT) || 1433,
    options: {
        encrypt: false
    }
}

module.exports = config

