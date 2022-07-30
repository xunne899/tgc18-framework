const express = require('express');
const hbs = require('hbs')
const wax = require('wax-on');

const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);



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


app.set('view engine', 'hbs');

// static folder
app.use(express.static('public'))

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts')

const landingRoutes = require('./routes/landing');
const productRoutes = require('./routes/products');

app.use('/',landingRoutes)

// ==> /xyz is a prefix can name anything to productRoutes
// most important is to link to the correct const var--- productRoutes (***,productRoutes)
app.use('/products',productRoutes);



app.listen(3000, function(){
    console.log("Server has started");
})