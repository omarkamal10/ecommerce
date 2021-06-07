const express = require('express')
const router = express.Router();
var auth = require('../config/auth')
var isAdmin = auth.isAdmin

//Get page model
var Page = require('../models/page')

//GET pages index
router.get('',isAdmin,async (req,res) => {
    var errors = req.validationErrors();
    var pages = await Page.find({}).sort({sorting:1}).exec((err,pages) => {
        res.render('admin/pages',{
            pages:pages,
            errors:errors
        })
    });
    
})


//GET add page
router.get('/add-page',isAdmin,(req,res) => {
    var title = ""
    var slug = ""
    var content = ""

    var errors = req.validationErrors();
    res.render('admin/add_page' , {
        errors:errors,
        title:title,
        slug:slug,
        content:content
    })
})


//GET edit page
router.get('/edit-page/:id',isAdmin,(req,res) => {
    Page.findById(req.params.id,(err,page) => {
        if (err) return console.log(err);

        var errors = req.validationErrors();
        res.render('admin/edit_page' , {
            errors:errors,
            title:page.title,
            slug:page.slug,
            content:page.content,
            id: page._id
        })

    })


})

router.post('/edit-page/:id',(req,res) => {
    req.checkBody('title','Title must have value').notEmpty()
    req.checkBody('content','Content must have value').notEmpty()

    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g,'-').toLowerCase();
    if (slug == "") slug = title.replace(/\s+/g,'-').toLowerCase();
    var content = req.body.content;
    var id = req.params.id;

    var errors = req.validationErrors();

    if (errors) {
        return res.render("/admin/edit_page",{
            errors:errors,
            title:title,
            slug:slug,
            content:content,
            id:id
        })
    }

    Page.findOne({slug:slug,_id:{'$ne':id}},(err,page) =>{
        if (page){
            req.flash('danger','Slug exists. Choose another.')
            res.render('admin/edit_page',{
                errors:errors,
                title:title,
                slug:slug,
                content:content,
                id:id
            })
        }
        else{
            Page.findById(id,(err,page) => {
                if (err) return console.log(err);

                page.title = title
                page.slug= slug
                page.content = content

                page.save((err) =>{
                    if (err) return console.log(err);
                    req.flash('success','Page edited!')
                    res.redirect('/admin/pages/edit-page/'+id)
                })
            })
        }

    })



})


//POST add page
router.post('/add-page',(req,res) => {

    req.checkBody('title','Title must have value.').notEmpty();
    req.checkBody('content','Content must have value.').notEmpty();

    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g,'-').toLowerCase();
    if (slug == "") slug = title.replace(/\s+/g,'-').toLowerCase();
    var content = req.body.content;

    var errors = req.validationErrors();

    if (errors) {
        console.log(errors);
        res.render('admin/add_page' , {
            errors:errors,
            title:title,
            slug:slug,
            content:content
        })
    }
    else{
        Page.findOne({slug:slug} , (err,page) => {
            if (page) {
                req.flash('danger','Page slug exists,choose another.')
                res.render('admin/add_page' , {
                    title:title,
                    slug:slug,
                    content:content
                })
            }
            else{
                var page = new Page({
                    title:title,
                    slug:slug,
                    content:content,
                    sorting: 100
                })
            }

            page.save((err) => {
                if (err) return console.log(err);
                Page.find({}).sort({sorting:1}).exec((err,pages) => {
                    if (err) {
                      console.log(err);
                    }
                    else{
                      req.app.locals.pages = pages 
                    }
                  })
                req.flash('success','Page Added!')
                res.redirect('/admin/pages')
            })
        })
    }

    
    
})
//Sort page function
function sortPages(ids,callback) {
    var count = 0

      for (var i = 0;i<ids.length;i++){
          var id = ids[i]
          count++

          (function (count) {
              
          
            Page.findById(id,(err,page) =>{
            page.sorting = count
            page.save((err) => {
                if (err) {
                    console.log(err);
                }
                ++count;
                if (count > ids.length) {
                    callback();
                }
            })
          })
        })(count)
          
      }
}
  //POST reorder pages 
  router.post('/reorder-pages',(req,res) => {
      var ids = req.body['id[]']

      sortPages(ids,() => {
         Page.find({}).sort({sorting:1}).exec((err,pages) => {
            if (err) {
              console.log(err);
            }
            else{
              req.app.locals.pages = pages 
            }
          })
      })

      

});

//Delete page
router.get('/delete-page/:id', isAdmin,(req,res) => {
    console.log(req.params.id);
    Page.findByIdAndRemove(req.params.id)
    .then(() => {
        console.log("Post deleted!");
        Page.find({}).sort({sorting:1}).exec((err,pages) => {
            if (err) {
              console.log(err);
            }
            else{
              req.app.locals.pages = pages 
            }
          })
        req.flash('success','Post Deleted!')
        res.redirect('/admin/pages/')
    })
    .catch((err) => {
        console.log(err);
    })
})

module.exports = router