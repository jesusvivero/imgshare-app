// helpers de handlebars configurado en config.js en el motor de plantillas
// estos helpers son para ser usados en el cliente o mejor dicho en las vistas
const moment = require('moment');
const helpers = {};


helpers.timeago = timestamp => {
  return moment(timestamp).startOf('minute').fromNow(); // ver documentacion de moment
}


module.exports = helpers;
