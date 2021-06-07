const express = require('express')
const router = express.Router();
var auth = require('../config/auth')
var isAdmin = auth.isAdmin

//Get category model
var Category = require('../models/category');
const Page = require('../models/page');

//GET Category index
router.get('',isAdmin,async (req,res) => {
    var errors = req.validationErrors();
    Category.find((err,categories)=>{
        if (err) return console.log(err);
        res.render('admin/categories',{
            categories:categories,
            errors:errors
        })
    })
    
})

//get Add category 
router.get('/add-category',isAdmin,(req,res) => {
    var title = ""
    var errors = req.validationErrors();
    res.render('admin/add_category',{
        title:title,
        errors:errors
    })

})

//get EDIT category 
router.get('/edit-category/:slug',isAdmin,(req,res) => {
    var errors = req.validationErrors();
    Category.findOne({slug:req.params.slug},(err,category) =>{
        if (err) return console.log(err);
        res.render('admin/edit_category',{
            errors:errors,
            title:category.title,
            slug:category.slug,
            id:category._id
        })
    })
})

//POST EDIT category
router.post('/edit-category/:slug',(req,res)=>{
    req.checkBody('title','Title must have value').notEmpty()
    var title = req.body.title
    var slug = title.replace(/\s+/g,'-').toLowerCase()
    var id = req.body.id

    var errors = req.validationErrors();
    if (errors) {
       return res.render('admin/add_category',{
            errors:errors,
            title:title,
            slug:slug,
            id:id
        })
    }
        Category.findOne({slug:slug,_id:{'$ne':id}},(err,category) => {
            if (category) {
                req.flash('danger','Category already exists!')
                res.render('admin/add_category',{
                    errors:errors,
                    title:title
                })
            }
            else{
                Category.findById(id,(err,category) => {
                    if (err) return console.log(err);

                    category.title = title
                    category.slug = slug
                    category.save((err) => {
                        if (err) return console.log(err);
                        Category.find((err,categories) => {
                            if (err) {
                              console.log(err);
                            }
                            else{
                              req.app.locals.categories = categories 
                            }
                          })
                        req.flash('success','Category Edited!')
                        res.redirect('/admin/categories')
                })
                
            })
        }
        })
    
})

//POST add category
router.post('/add-category',(req,res) =>{
    req.checkBody('title','Title must have value').notEmpty()
    var title = req.body.title
    var slug = title.replace(/\s+/g,'-').toLowerCase()

    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/add_category',{
            errors:errors,
            title:title
        })
    }
    else{
        Category.findOne({slug:slug},(err,category) => {
            if (category) {
                req.flash('danger','Category already exists!')
                res.render('admin/add_category',{
                    errors:errors,
                    title:title
                })
            }
            else{
                var category = new Category({
                    title:title,
                    slug:slug
                })
            }
            category.save((err) => {
                if (err) return console.log(err);
                Category.find((err,categories) => {
                    if (err) {
                      console.log(err);
                    }
                    else{
                      req.app.locals.categories = categories 
                    }
                  })
                req.flash('success','Category Added!')
                res.redirect('/admin/categories')
            })
        })
    }

})

router.get('/delete-category/:id',isAdmin,(req,res) => {
    Category.findByIdAndRemove(req.params.id)
    .then(() => {
        Category.find((err,categories) => {
            if (err) {
              console.log(err);
            }
            else{
              req.app.locals.categories = categories 
            }
          })
        req.flash('success','Post Deleted!')
        res.redirect('/admin/categories')
    })
    .catch((e) => {
        console.log(e);
    })
})



module.exports = router