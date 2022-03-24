const express = require('express')

const cors = require('cors')
const logger = require('morgan')

const accueilRouter = require('./routes/accueil')
const articlesRouter = require('./routes/articles')
const clientsRouter = require('./routes/clients')
const utilisateursRouter = require('./routes/utilisateurs')
const postsRouter = require('./routes/posts')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(logger('dev'))

app.use('/api/v1', accueilRouter)
app.use('/api/v1/articles', articlesRouter)
app.use('/api/v1/clients', clientsRouter)
app.use('/api/v1/utilisateurs', utilisateursRouter)
app.use('/api/v1/posts', postsRouter)

app.use((req, res, next) => {
  res.status(404).json({ Erreur: 'Requête invalide' })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`API connectée à l'ERP interne démarrée, à l'écoute sur le port ${PORT} ...`)
})