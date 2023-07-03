const express = require('express')
const router = express.Router()

const Clients = require('./../database/clients')

router.get('/', (req, res) => {
    Clients.getAll()
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ Erreur: error.toString() }))
})

router.get('/code/:code', (req, res) => {
    Clients.getOne(req.params.code)
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ Erreur: error.toString() }))
})

router.get('/count', (req, res) => {
    Clients.getCount()
        .then(data => data)
        .catch(error => res.status(500).json({ Erreur: error.toString() }))
})

router.get('/page/:offset/:count/:sort/:order', (req, res) => {
    Clients.getPage(req.params.offset, req.params.count, req.params.sort, req.params.order)
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ Erreur: error.toString() }))
})

router.get('/top/:top', (req, res) => {
    Clients.getTop(req.params.top)
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ Erreur: error.toString() }))
})

router.get('/nombre', (req, res) => {
    Clients.getCount()
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ Erreur: error.toString() }))
})


router.get('/getGestimumClients', (req, res) => {
    Clients.getGestimumClients()
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ Erreur: error.toString() }))
})



module.exports = router


