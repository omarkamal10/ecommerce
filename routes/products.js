const express = require('express');
const Category = require('../models/category');
const Product = require('../models/product');
const router = express.Router();


//Get all products
router.get('/',(req,res) => {
    Product.find((err,products) => {
        if (err) return console.log(err);
        res.render('all_products',{
            title: "All products",
            products:products
        })
    })
})

//Get product by category
router.get('/:category',(req,res) => {
    Category.findOne({category:req.params.category},() =>{
        Product.find({category:req.params.category},(err,products) => {
            if (err) return console.log(err);

            res.render('productsByCategory',{
                title: products.title,
                products:products
            })
        })
    })

    
})

router.get('/:category/:product',(req,res) => {

        var loggedin = (req.isAuthenticated()) ? true : false
        Product.findOne({slug:req.params.product},(err,products) => {
            if (err) return console.log(err);

            res.render('product',{
                title: products.title,
                product:products,
                loggedin: loggedin
            })
        })

    
})




module.exports = router