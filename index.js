const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
var helpers = require("handlebars-helpers")({
  handlebars: hbs.handlebars,
});

const session = require("express-session");
const flash = require("connect-flash");
const FileStore = require("session-file-store")(session);
const csrf = require("csurf");

const app = express();

// enable env files
require('dotenv').config();

// set up sessions
// setup sessions
app.use(session({
  store: new FileStore(),  // we want to use files to store sessions
  secret: process.env.SESSION_SECRET_KEY,// used to generate the session id
  resave: false, // do we automatically recreate the session even if there is no change to it
  saveUninitialized: true, // if a new browser connects do we create a new session
}))


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
// }

// Share the user data with hbs files
app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  next();
});

// app.use(csrf());

app.use(function (err, req, res, next) {
  if (err && err.code == "EBADCSRFTOKEN") {
    req.flash("error_messages", "The form has expired. Please try again");
    res.redirect("back");
  } else {
    next();
  }
});

app.use(csrf());

app.use(function(req,res,next){

  // the csrfToken function is avaliable because of `app.use(csrf())`
  res.locals.csrfToken = req.csrfToken(); 
  console.log(req.csrfToken());
  next();

})
// main()
app.listen(3000, function () {
  console.log("Server has started");
});
