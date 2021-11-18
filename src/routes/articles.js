const express = require('express');
const router = express.Router();

const Articles = require('./../database/articles');

router.get('/', function (req, res) {
    Articles.getAll()
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ Erreur: error.toString() }));
})

router.get('/code/:code', function (req, res) {
    Articles.getOne(req.params.code)
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ Erreur: error.toString() }));
})

router.get('/top/:top', function (req, res) {
    Articles.getTop(req.params.top)
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ Erreur: error.toString() }));
})

router.get('/nombre', function (req, res) {
    Articles.getCount()
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ Erreur: error.toString() }));
})

module.exports = router;