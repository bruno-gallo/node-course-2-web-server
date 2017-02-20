const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// variable de entorno seteada por heroku
const port = process.env.port || 3000;
var app = express();

//define directorio de las partials (templates)
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');


// definir MiddleWare
app.use((request, response, next) => {
    var now = new Date().toString();
    var log = `${now}: ${request.method} ${request.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n');
    next();
});

// si se descomenta esto, entra en modo mantenimiento
// app.use((request, response, next) => {
//     response.render('maintenance.hbs');
// });

app.use(express.static(__dirname + '/public'));

//Define una funcion para poder ser llamada desde dentro de los archivos .hbs
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

//Define lo que se obtiene al cargar localhost:3000
app.get('/', (request, response) => {
    // response.send("<h1>Hello Express!</h1>");
    response.render('home.hbs', {
        pageTitle: "Home",
        welcomeMessage: 'Welcome!!'
    });
});

//Define lo que se obtiene al cargar localhost:3000/about
app.get('/about', (request, response) => {
    response.render('about.hbs', {
        pageTitle: 'About Page'
    });
});

app.get('/bad', (request, response) => {
    response.send({
        errorMessage: "Unable to fulfill request"
    });
});

app.listen(port, () => {
    console.log(`Server is up on ${port}`);
});
