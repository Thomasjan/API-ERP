const express = require('express');
const router = express.Router();

const Posts = require('./../database/posts');

router.get('/id/:id', function (req, res) {
    const id = req.params.id;
    try {
        const data = Posts.getPostById(id);
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ Erreur : `Post ${id} non trouvé`});
        }
    } catch (error) {
        res.status(404).json({ Erreur : error.toString()});
    }
})

module.exports = router;