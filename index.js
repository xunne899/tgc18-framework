const express = require('express');
const hbs = require('hbs')
const wax = require('wax-on');

const app = express();

app.set('view engine', 'hbs');

// static folder
app.use(express.static('public'))

// setup wax-on
wax.on(hbs.handlebars);

const landingRoutes = require('./routes/landing');

app.use(landingRoutes)



app.listen(3000, function(){
    console.log("Server has started");
})