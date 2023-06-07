const mongoose = require('mongoose')
const modelLink = require('../models/linkModel')

const Links = new mongoose.model('links', modelLink)


async function redirect(req, res){
    let titleLink = req.params.title
    
    if(titleLink == 'favicon.ico'){
        return
    }

    try{
        let docLink = await Links.findOneAndUpdate({titulo: titleLink}, {$inc:{'click': 1}})

        if(docLink.url.substr(0, 1) == 'w'){
            res.redirect(`https://${docLink.url}`)
            return
        }

        if(docLink.url.substr(0, 8) == 'https://' || docLink.url.substr(0,7) == 'http://'){
            res.redirect(docLink.url)
            return
        }

        if(docLink.url.substr(0,4) != 'http'){
            res.render('error', {msg: 'Link inválido =('})
        }

    }catch(err){
        const errorInfo = {msg: 'Link não encontrado! :('}
        res.send('error', {errorInfo})
    }
}


async function addLink(req, res){

    let dataNewLink = req.body

    if(dataNewLink.titulo == '' || dataNewLink.url == '' ){
        res.redirect('/addlink')
        return
    }

    if(dataNewLink.url.substr(0,4) != 'http'){
        let errorInfo = {msg: 'Obrigatório colocar "https://" no arquivo'}
        res.render('error', errorInfo)
        return
    }

    try {
        if(dataNewLink){
        const savedLink = await Links(dataNewLink).save()
        
        const dataLink = {...savedLink._doc}
        dataLink['msg'] = 'Link foi adicionado com sucesso!'

        let base64Link = Buffer.from(JSON.stringify(dataLink), 'utf8').toString('base64')
        
        let encondeLink = encodeURIComponent(base64Link, 'utf8')

        res.redirect(`/conflink/${encondeLink}`)
        }

    }catch(err){
        const errorInfo = {msg: err}
        res.render('error', errorInfo)
    }

   
}

function confLink(req, res){
    let decodeReqLink = decodeURIComponent(req.params.msg)
    
    let dataLink = Buffer.from(decodeReqLink, 'base64').toString('utf-8')

    let objectLink = JSON.parse(dataLink)

    res.render('conflink', objectLink)
}

async function managelinks(req, res){

    try{
        let links = await Links.find({})

        res.render('managelinks', {links})

    }catch(err){
        const errorInfo = {msg: err}
        res.render('error', errorInfo)
    }


}

async function deleteLink(req,res){

    docDelete = req.params.id

    try{
        await Links.findOneAndDelete({_id: docDelete})

        res.status(200).json(docDelete)

    }catch(err){
        const errorInfo = {msg: err}
        res.render('error', errorInfo)
    }

}

async function editLink(req,res){

    let id = req.params.id

    try{

        let dataLink =  await Links.findOne({_id: id})

        if(dataLink){
            res.render('editlink', dataLink)
        }

    }catch(err){
        const errorInfo = {msg: err}
        res.render('error', errorInfo)
    }

}


async function updateLink(req, res){
    let id = req.params.id
    let dataReq = req.body

    let newDataLink = dataReq
    
    if(newDataLink.titulo == '' || newDataLink.url == ''){
        res.redirect(`/editlink/${id}`)
        return
    }

    if(newDataLink.url.substr(0,4) != 'http'){
        res.render('error', {msg: 'Operação cancelada! É necessário colocar "https://"'})
        return
    }
    
    try{
         await Links.findOneAndUpdate({_id: id}, newDataLink)
        newDataLink['msg'] = "Link atualizado com sucesso!"

        res.render('conflink', newDataLink)

    }catch(err){
        const errorInfo = {msg: err}
        res.render('error', errorInfo)
    }
}

module.exports = {addLink, confLink, managelinks, deleteLink, editLink, updateLink, redirect}