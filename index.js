const express = require('express');
const hbs = require('hbs')
const wax = require('wax-on');

const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);
const csrf = require('csurf')


const app = express();

// set up sessions
app.use(session({
    store: new FileStore(),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }))
  

  app.use(flash())

  // Register Flash middleware
  app.use(function (req, res, next) {
      res.locals.success_messages = req.flash("success_messages");
      res.locals.error_messages = req.flash("error_messages");
      next();
  });
  app.use(express.urlencoded({
    extended: false
  }))

app.set('view engine', 'hbs');

// static folder
app.use(express.static('public'))

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts')

const landingRoutes = require('./routes/landing');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users')

app.use('/',landingRoutes)

// ==> /xyz is a prefix can name anything to productRoutes
// most important is to link to the correct const var--- productRoutes (***,productRoutes)
app.use('/products',productRoutes);
app.use('/users', userRoutes);



// Share the user data with hbs files
app.use(function(req,res,next){
    res.locals.user = req.session.user;
    next();
})

app.use(csrf());


app.use(function (err, req, res, next) {
    if (err && err.code == "EBADCSRFTOKEN") {
        req.flash('error_messages', 'The form has expired. Please try again');
        res.redirect('back');
    } else {
        next()
    }
});

app.use(function(req,res,next){

  // the csrfToken function is avaliable because of `app.use(csrf())`
  res.locals.csrfToken = req.csrfToken(); 
  console.log(req.csrfToken());
  next();

})

app.listen(3000, function(){
    console.log("Server has started");
})