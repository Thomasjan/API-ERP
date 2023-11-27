const express = require('express')
const router = express.Router()

const Actions = require('./../database/actions')

router.get('/', (req, res) => {
    Actions.getAll(req, res)
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ Erreur: error.toString() }))
})



module.exports = router