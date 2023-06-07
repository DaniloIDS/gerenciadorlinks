const express = require('express')
const router = express.Router()
const linkController = require('../controllers/linkController')


router.get('/', (req, res)=>{res.render('index')})

router.get('/addlink', (req, res)=>{res.render('addlink')})

router.get('/conflink/:msg', express.urlencoded({extended: true}), linkController.confLink)

router.get('/managelinks', linkController.managelinks)

router.get('/editlink/:id', linkController.editLink)

router.get('/:title', express.urlencoded({extended: true}), linkController.redirect)

router.post('/editlink/:id', express.urlencoded({extended: true}), linkController.updateLink)

router.post('/addlink', express.urlencoded({extended: true}), linkController.addLink)

router.delete('/managelinks/:id', express.urlencoded({extended: true}), linkController.deleteLink)

router.get('*', (req, res) => {
    res.status(404).render('error', { msg: "Página não encontrada" });
});

module.exports = router
