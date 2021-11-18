const express = require('express');
const router = express.Router();

const Clients = require('./../database/clients');

router.get('/', function (req, res) {
    Clients.getAll()
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ Erreur: error.toString() }));
})

router.get('/code/:code', function (req, res) {
    Clients.getOne(req.params.code)
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ Erreur: error.toString() }));
})

router.get('/top/:top', function (req, res) {
    Clients.getTop(req.params.top)
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ Erreur: error.toString() }));
})

router.get('/nombre', function (req, res) {
    Clients.getCount()
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ Erreur: error.toString() }));
})


module.exports = router;