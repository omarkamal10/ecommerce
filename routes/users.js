const express = require('express');
const User = require('../models/user');
const router = express.Router();
const passport = require('passport')
const bcrypt = require('bcryptjs')


//Get Register
router.get('/register',(req,res) => {
    res.render('register',{
        title: "Register"
    })
})


//Post Register
router.post('/register',(req,res) => {
    var name = req.body.name
    var email = req.body.email
    var username = req.body.username
    var password = req.body.password
    var password2 = req.body.password2

    req.checkBody('name','Name is required!').notEmpty()
    req.checkBody('email','Email is required!').notEmpty()
    req.checkBody('username','Username is required!').notEmpty()
    req.checkBody('password','Password is required!').notEmpty()
    req.checkBody('password2','Passwords do not match!').equals(password)

    var errors = req.validationErrors()

    if (errors) {
        res.render('register',{
            errors:errors,
            user:null,
            title: "Register"
        })
    }
    else{
        User.findOne({username:username},(err,user) => {
            if (err) console.log(err);

            if (user) {
                req.flash('danger','User already exists!')
                res.redirect('/user/register')
            }
            else{
                var user = new User({
                    name:name,
                    username:username,
                    email:email,
                    password:password,
                    admin:0
                })
                bcrypt.genSalt(10,(err,salt) => {
                    bcrypt.hash(user.password,salt,(err,hash) => {
                        if (err) {
                            console.log(err);
                        }
                        user.password = hash;
                        user.save((err) => {
                            if (err) console.log(err);
                            else{
                                req.flash('success','Welcome to our website ya Fa2eer!')
                                res.redirect('/user/login')
                            }
                        })
                    })
                })
            }
        })
    }
})
//Get login
router.get('/login',(req,res) => {
    if (res.locals.user) res.redirect('/')
    res.render('login',{
        title:"Log in"
    })

})

//Post login
router.post('/login',(req,res,next) => {
    passport.authenticate('local',{
        successRedirect:'/',
        failureRedirect:'/user/login',
        failureFlash:true
    })(req,res,next);

})

//get logout
router.get('/logout',(req,res) => {
    req.logout();
    req.flash('success','You logged out sucessfully!')
    res.redirect('/user/login')

})



module.exports = router