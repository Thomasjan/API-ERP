const express = require('express');
const router = express.Router();

const Utilisateurs = require('./../database/utilisateurs');

router.get('/', function (req, res) {
    Utilisateurs.getAll()
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ Erreur: error.toString() }));
})

router.get('/code/:code', function (req, res) {
    Utilisateurs.getOne(req.params.code)
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ Erreur: error.toString() }));
})

router.get('/top/:top', function (req, res) {
    Utilisateurs.getTop(req.params.top)
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ Erreur: error.toString() }));
})

router.get('/nombre', function (req, res) {
    Utilisateurs.getCount()
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ Erreur: error.toString() }));
})

module.exports = router;