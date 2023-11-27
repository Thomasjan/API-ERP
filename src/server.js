const express = require('express')

const cors = require('cors')
const logger = require('morgan')
const jwt = require('jsonwebtoken');

require('dotenv').config()
const colors = require('colors')

const generateToken = require('./middlewares/generateToken')
const verifyToken = require('./middlewares/verifyToken')

const accueilRouter = require('./routes/accueil')
const articlesRouter = require('./routes/articles')
const affairesRouter = require('./routes/affaires')
const actionsRouter = require('./routes/actions')
const clientsRouter = require('./routes/clients')
const utilisateursRouter = require('./routes/utilisateurs')
const postsRouter = require('./routes/posts')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(logger('dev'))

app.use('/api/v1', accueilRouter)
app.use('/api/v1/articles', generateToken, verifyToken, articlesRouter)
app.use('/api/v1/affaires', generateToken, verifyToken, affairesRouter)
app.use('/api/v1/actions', generateToken, verifyToken, actionsRouter)
app.use('/api/v1/clients', generateToken, verifyToken, clientsRouter)
app.use('/api/v1/utilisateurs', generateToken, verifyToken, utilisateursRouter)
app.use('/api/v1/posts', generateToken, verifyToken, postsRouter)




app.use((req, res, next) => {
  res.status(404).json({ Erreur: 'Requête invalide' })
})




const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(colors.magenta(`API ERP interne démarrée sur le port ${colors.cyan(PORT)} ...`))
})