const mongoose = require('./database');
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
var expressValidator = require('express-validator');
const fileUpload = require('express-fileupload')
const passport = require('passport')
const port = process.env.PORT || 3000;



const app = express();

app.use(expressValidator())

//view engines setup
app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')


//set global error values
app.locals.errors = null

//Get page model
var Page = require('./models/page')

//Get all pages to pass to header.ejs
Page.find({}).sort({sorting:1}).exec((err,pages) => {
  if (err) {
    console.log(err);
  }
  else{
    app.locals.pages = pages 
  }
})

//Get category model
var Category = require('./models/category')

//Get all categories to pass to header.ejs
Category.find((err,categories) => {
  if (err) {
    console.log(err);
  }
  else{
    app.locals.categories = categories 
  }
})




//set public folder
app.use(express.static(path.join(__dirname,'public')))
//express fileupload middleare
app.use(fileUpload())

//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



//express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    //cookie: { secure: true }
  }))


  //express messages
  app.use(require('connect-flash')());
  app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
//passport config
require('./config/passport')(passport)
//passport middleware
app.use(passport.initialize())
app.use(passport.session())


//
app.get('*',(req,res,next) => {
  res.locals.cart = req.session.cart;
  res.locals.user = req.user || null
  next();
})


//set routes
const pagesRouter = require('./routes/pages')
app.use('/',pagesRouter)

const productsRouter = require('./routes/products')
app.use('/user/products',productsRouter)

const adminPagesRouter = require('./routes/adminPages')
app.use('/admin/pages',adminPagesRouter)

const adminCategoriesRouter = require('./routes/adminCategories')
app.use('/admin/categories',adminCategoriesRouter)

const adminProductsRoutes = require('./routes/adminProducts')
app.use('/admin/products',adminProductsRoutes)


const cart = require('./routes/cart')
app.use('/cart',cart)

const user = require('./routes/users')
app.use('/user',user)












app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});


