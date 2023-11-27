const express = require('express')
const router = express.Router()

const Affaires = require('./../database/affaires')

router.get('/', (req, res) => {
    Affaires.getAll(req, res)
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ Erreur: error.toString() }))
})



module.exports = router