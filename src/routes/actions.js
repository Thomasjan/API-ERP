const express = require('express')
const router = express.Router()
const { queryMiddleware } = require('../middlewares/queryParams')

const Actions = require('./../database/actions')

router.get('/', queryMiddleware, (req, res) => {
    Actions.getAll(req, res)
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ Erreur: error.toString() }))
})
//update
router.put('/updateAction/:id', (req, res) => {
    Actions.updateAction(req, res)
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ Erreur: error.toString() }))
})



module.exports = router