const express = require('express')
const router = express.Router();
const mkdirp = require('mkdirp')
const fs = require('fs-extra')
const resizeImg = require('resize-img')
var auth = require('../config/auth')
var isAdmin = auth.isAdmin

//Get product model
var Product = require('../models/product')

//Get Category model
var Category = require('../models/category')

//GET products index
router.get('', isAdmin,(req,res) => {
    var count;
    var errors = req.validationErrors();
    Product.count((err,c) => {
        count = c;
    })
    Product.find((err,products) => {
        res.render('admin/products', {
            errors:errors,
            products:products,
            count:count
        })
    })
    
})


//GET add product
router.get('/add-product',isAdmin,(req,res) => {
    var title = ""
    var desc = ""
    var price = ""

    var errors = req.validationErrors();

    Category.find((err,categories) => {
        res.render('admin/add_product' , {
            errors:errors,
            title:title,
            desc:desc,
            categories:categories,
            price:price
        })
    })
    
})


//GET edit page
router.get('/edit-product/:id',isAdmin,(req,res) => {
    var errors;

    if (req.session.errors) errors = req.session.errors
    req.session.error = null

    Category.find((err,categories) => {
        if (err) {
             console.log(err);
             res.redirect('/admin/products')
        }

        Product.findById(req.params.id,(err,product) => {
            if (err) return console.log(err);
            res.render('admin/edit_product' , {
                errors:errors,
                title:product.title,
                desc:product.desc,
                categories:categories,
                category:product.category.replace(/\s+/g,'-').toLowerCase(),
                price:product.price,
                id:req.params.id
            })
        })
        
    })
     


})


//Post edit products
router.post('/edit-product/:id',(req,res) => {
    req.checkBody('title','Title must have value').notEmpty()
    req.checkBody('desc','Description must have value').notEmpty()
    req.checkBody('price','Price must have value').isDecimal()

    var title = req.body.title;
    var slug = title.replace(/\s+/g,'-').toLowerCase();
    var desc = req.body.desc;
    var price = req.body.price;
    var category = req.body.category;
    var id = req.params.id;

    var errors = req.validationErrors();

    if (errors) {
        req.session.errors = errors
        res.redirect('/admin/products/edit-product/' + id)
    }
    else {
        Product.findOne({slug:slug,_id: {'$ne':id}},(product) =>{
            if (product) {
                req.flash('danger','Product title exists, choose another')
                res.redirect('/admin/products/edit-product/' + id)
            }
            else {
                Product.findById(id,(err,product) => {
                    if (err) return console.log(err);
                    product.title = title;
                    product.slug = slug;
                    product.desc = desc;
                    product.category = category;
                    product.price = parseFloat(price).toFixed(2);
               

                product.save((err) => {
                    if (err) return console.log(err);
                    req.flash('success','Product edited!')
                    res.redirect('/admin/products/edit-product/'+id)
                })
                })
            }
        })
    }


    


})


//POST add product
router.post('/add-product',(req,res) => {

    req.checkBody('title','Title must have value.').notEmpty();
    req.checkBody('desc','Description must have value.').notEmpty();
    req.checkBody('price','Price must have value.').isDecimal();


    var title = req.body.title;
    var slug = title.replace(/\s+/g,'-').toLowerCase();
    var desc = req.body.desc;
    var price = req.body.price;
    var category  = req.body.category;

    var errors = req.validationErrors();

    if (errors) { 
        Category.find((err,categories) => {
            res.render('admin/add_product' , {
                errors:errors,
                title:title,
                desc:desc,
                categories:categories,
                price:price
            })
        })
    }
    else{
        Product.findOne({slug:slug} , (err,product) => {
            if (product) {
                req.flash('danger','Product slug exists,choose another.')
                Category.find((err,categories) => {
                    res.render('admin/add_product' , {
                        errors:errors,
                        title:title,
                        desc:desc,
                        categories:categories,
                        price:price
                    })
                })
            }
            else{
                var price2 = parseFloat(price).toFixed(2)
                var product = new Product({
                    title:title,
                    slug:slug,
                    desc:desc,
                    price:price2,
                    category: category
                    
                })
            }

            product.save((err) => {
                if (err) return console.log(err);
                req.flash('success','Product Added!')
                res.redirect('/admin/products')
            })
        })
    }

    
    
})


//Delete product
router.get('/delete-product/:id',isAdmin, (req,res) => {
    Product.findByIdAndRemove(req.params.id)
    .then(() => {
        req.flash('success','Product deleted')
        res.redirect('/admin/products')
    })
    .catch((e) => {
        console.log(e);
    })
})

module.exports = router