const express = require('express')
const router = express.Router()

const Articles = require('./../database/articles')

router.get('/', (req, res) => {
    Articles.getAll()
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ Erreur: error.toString() }))
})

router.get('/code/:code', (req, res) => {
    Articles.getOne(req.params.code)
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ Erreur: error.toString() }))
})

router.get('/count', (req, res) => {
    Articles.getCount()
        .then(data => data)
        .catch(error => res.status(500).json({ Erreur: error.toString() }))
})

router.get('/page/:offset/:count/:sort/:order', (req, res) => {
    Articles.getPage(req.params.offset, req.params.count, req.params.sort, req.params.order)
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ Erreur: error.toString() }))
})

router.get('/top/:top', (req, res) => {
    Articles.getTop(req.params.top)
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ Erreur: error.toString() }))
})

router.get('/nombre', function (req, res) {
    Articles.getCount()
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ Erreur: error.toString() }))
})

module.exports = router