const express = require('express')
const router = express.Router()
const { queryMiddleware } = require('../middlewares/queryParams')

const Utilisateurs = require('../database/utilisateurs')

router.get('/', (req, res) => {
    Utilisateurs.getAll()
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ Erreur: error.toString() }))
})

router.get('/code/:code', (req, res) => {
    Utilisateurs.getOne(req.params.code)
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ Erreur: error.toString() }))
})

router.get('/contacts', queryMiddleware, (req, res) => {
    Utilisateurs.getContacts(req, res)
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ Erreur: error.toString() }))
})

router.put('/update/:id', (req, res) => {
    Utilisateurs.update(req, res)
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ Erreur: error.toString() }))
})

router.get('/top/:top', (req, res) => {
    Utilisateurs.getTop(req.params.top)
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ Erreur: error.toString() }))
})

router.get('/nombre', (req, res) => {
    Utilisateurs.getCount()
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ Erreur: error.toString() }))
})


router.get('/getGestimumUsers', (req, res) => {
    Utilisateurs.getGestimumUsers()
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ Erreur: error.toString() }))
})

router.get('/getGestimumUsersOfClient/:code', (req, res) => {
    Utilisateurs.getGestimumUsersOfClient(req.params.code)
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ Erreur: error.toString() }))
})

module.exports = router