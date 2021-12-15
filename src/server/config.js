const express = require('express');
const path = require('path');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const { engine } = require('express-handlebars');
const morgan = require('morgan');
const multer = require('multer');
const errorHandler = require('errorhandler');

const routes = require('../routes/index');

module.exports = (app) => {

  // Settings
  app.set('port', process.env.PORT || 3000);
  app.set('views', path.join(__dirname, '../views'));
  app.engine('.hbs', engine({
    defaultLayout: 'main', // la plantilla principal, donde inicia
    partialsDir: path.join(app.get('views'), 'partials'), // La carpeta donde estarán los partials pequeños segmentos de html que usaremos en nuestra app
    layoutsDir: path.join(app.get('views'), 'layouts'), //La carpeta donde estarán plantillas configuradas que se reutilizarán
    extname: '.hbs',
    helpers: require('./helpers'),// funciones que se pueden usar dentro de handlebars
    handlebars: allowInsecurePrototypeAccess(Handlebars)
  })); // definir motor de plantillas (la extensión de los archivos de plantilla es .handlebars, pero lo acortamos con .hbs)

  app.set('view engine', '.hbs'); // usar el motor de plantillas definido

  // Middlewares
  app.use(morgan('dev'));
  app.use(multer({
    dest: path.join(__dirname, '../public/upload/temp')
  }).single('image'));
  app.use(express.urlencoded({
    extended: false
  }))
  app.use(express.json());


  // Routes
  routes(app);


  // Statis files
  app.use('/public', express.static(path.join(__dirname, '../public'))); // le damos el nombre /public (parametro 1), y despues la ruta del directorio de archivos estáticos (parametro 2)

  // errorhandlers
  if ('development' === app.get('env')) {
    app.use(errorHandler);
  }

  return app;

}
