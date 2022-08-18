// const express = require('express');
// const hbs = require('hbs')
// const wax = require('wax-on');
// var helpers = require('handlebars-helpers')({
//     handlebars: hbs.handlebars
//   });

// //requiring in the dependencies for sessions
// const session = require('express-session');
// const flash = require('connect-flash');
// // create a new session FileStore
// const FileStore = require('session-file-store')(session);

// // csrf token
// const csrf = require('csurf');

// // enable env files
// require('dotenv').config();

// const app = express();

// app.set('view engine', 'hbs');

// app.use(express.urlencoded({
//   extended: false
// }))

// // static folder
// app.use(express.static('public'))

// // setup wax-on
// wax.on(hbs.handlebars);
// wax.setLayoutPath('./views/layouts')

// // setup sessions
// app.use(session({
//   store: new FileStore(),  // we want to use files to store sessions
//   secret: process.env.SESSION_SECRET, // used to generate the session id
//   resave: false, // do we automatically recreate the session even if there is no change to it
//   saveUninitialized: true, // if a new browser connects do we create a new session
// }))

// // enable csrf protection
// // app.use(csrf());
// const csrfInstance = csrf();
// app.use(function(req,res,next){
//   // console.log("Checking for csrf exclusion");
//   if (req.url === '/checkout/process_payment') {
//     next();
//   } else {
//     csrfInstance(req,res,next);
//   }
// })

// app.use(function(req,res,next){

//   // the csrfToken function is avaliable because of `app.use(csrf())`
//   // req.csrfToken will be a falsely value if it is not available
//   if (req.csrfToken) {
//     res.locals.csrfToken = req.csrfToken();
//   }

//   next();

// })

// // register Flash messages
// app.use(flash());  // VERY IMPORTANT: register flash after sessions

// // setup a middleware to inject the session data into the hbs files
// app.use(function(req,res,next){
//   // res.locals will contain all the variables available to hbs files
//   res.locals.success_messages = req.flash('success_messages');
//   res.locals.error_messages = req.flash('error_messages');
//   next();
// })

// // setup a middleware to share data across all hbs files
// app.use(function(req,res,next){
//   res.locals.user = req.session.user;
//   next();
// })

// app.use(async function(req,res,next){
//   if (req.session.user) {
//     const cartItems = await getCart(req.session.user.id);
//     res.locals.cartCount = cartItems.toJSON().length;
//   }
//   next();
// });

// const landingRoutes = require('./routes/landing');
// const productRoutes = require('./routes/products');
// const userRoutes = require('./routes/users')
// const cloudinaryRoutes = require('./routes/cloudinary');
// const cartRoutes = require('./routes/carts');
// const checkoutRoutes = require('./routes/checkout');
// const { checkIfAuthenticated } = require('./middlewares');
// const { getCart } = require('./dal/carts');

// // first arg is the prefix
// app.use('/', landingRoutes);
// app.use('/products', productRoutes);
// app.use('/users', userRoutes);
// app.use('/cloudinary', cloudinaryRoutes);
// app.use('/cart', [checkIfAuthenticated], cartRoutes);
// app.use('/checkout', checkoutRoutes);

// app.listen(3000, function(){
//     console.log("Server has started");
// })

const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
var helpers = require("handlebars-helpers")({
  handlebars: hbs.handlebars,
});

const cors = require("cors");
const jwt = require("jsonwebtoken");

const session = require("express-session");
const flash = require("connect-flash");
const FileStore = require("session-file-store")(session);
const csrf = require("csurf");

const app = express();

// enable env files
require("dotenv").config();

app.use(cors());
// set up sessions
// setup sessions
app.use(
  session({
    store: new FileStore(), // we want to use files to store sessions
    secret: process.env.SESSION_SECRET, // used to generate the session id
    resave: false, // do we automatically recreate the session even if there is no change to it
    saveUninitialized: true, // if a new browser connects do we create a new session
  })
);

app.use(flash());

// Register Flash middleware
app.use(function (req, res, next) {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  next();
});
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

const landingRoutes = require("./routes/landing");
const productRoutes = require("./routes/products");
const userRoutes = require("./routes/users");
const cloudinaryRoutes = require("./routes/cloudinary.js");
const cartRoutes = require("./routes/carts");
const checkoutRoutes = require("./routes/checkout");
const { checkIfAuthenticated } = require("./middlewares");
const { getCart } = require("./dal/carts");

const api = {
  products: require("./routes/api/products"),
  users: require("./routes/api/users"),
};
// app.use('/',landingRoutes)

// // ==> /xyz is a prefix can name anything to productRoutes
// // most important is to link to the correct const var--- productRoutes (***,productRoutes)
// app.use('/products',productRoutes);
// app.use('/users', userRoutes);

// async function main() {
// if the URL begins exactly with a forward slash
// use the landingRoutes
app.use("/", landingRoutes);
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/cloudinary", cloudinaryRoutes);
app.use("/cart", [checkIfAuthenticated], cartRoutes);


// register api routes
app.use("/api/products", express.json(), api.products);
app.use("/api/users", express.json(), api.users);

// }

// Share the user data with hbs files
app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  next();
});

// app.use(csrf());

// app.use(function (err, req, res, next) {
//   if (err && err.code == "EBADCSRFTOKEN") {
//     req.flash("error_messages", "The form has expired. Please try again");
//     res.redirect("back");
//   } else {
//     next();
//   }
// });

// app.use(csrf());

// app.use(function (req, res, next) {
//   // the csrfToken function is avaliable because of `app.use(csrf())`
//   res.locals.csrfToken = req.csrfToken();
//   console.log(req.csrfToken());
//   next();
// });

// enable csrf protection
// app.use(csrf());
const csrfInstance = csrf();
app.use(function (req, res, next) {
  // console.log("Checking for csrf exclusion");
  if (req.url === "/checkout/process_payment" || req.url.slice(0, 5) == "/api/") {
    next();
  } else {
    csrfInstance(req, res, next);
  }
});

app.use(function (req, res, next) {
  // the csrfToken function is avaliable because of `app.use(csrf())`
  // req.csrfToken will be a falsely value if it is not available
  if (req.csrfToken) {
    res.locals.csrfToken = req.csrfToken();
  }

  next();
});

app.use(async function (req, res, next) {
  if (req.session.user) {
    const cartItems = await getCart(req.session.user.id);
    res.locals.cartCount = cartItems.toJSON().length;
  }
  next();
});

// main()
app.listen(3001, function () {
  console.log("Server has started");
});
