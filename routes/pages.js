const express = require('express');
const Page = require('../models/page');
const router = express.Router();


//Get /
router.get('/',(req,res) => {
    Page.findOne({slug:'home'},(err,page) => {
        if (err) return console.log(err);
        if(!page) {
            res.redirect('/')
        }
        else{
            res.render('index',{
                title:page.title,
                content: page.content
            })
        }
    })
})


//Get a page
router.get('/:slug',(req,res) => {
    var slug = req.params.slug

    Page.findOne({slug:slug},(err,page) => {
        if (err) return console.log(err);
        if(!page) {
            res.redirect('/')
        }
        else{
            res.render('index',{
                title:page.title,
                content: page.content
            })
        }
    })
})


module.exports = router