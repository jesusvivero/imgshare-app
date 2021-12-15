const path = require('path');
const { Schema, model } = require('mongoose');
const mongooseLeanVirtuals = require('mongoose-lean-virtuals'); // porque handlebars tiene problemas con los objetos mongoose, y se usa lean para convertirlos en objetos js normales, pero lean no admite variables virtuales, por eso se habilita este módulo para admitir la virtualidad con lean

const ImageSchema = new Schema({
  title: { type: String },
  description: { type: String },
  filename: { type: String },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now}
})

// crear una variable virtual para devolver un identificador, el cual será el nombre de la imagen pero sin la extensión.
ImageSchema.virtual('uniqueId')
  .get(function () {
    return this.filename.replace(path.extname(this.filename), '');
  })

ImageSchema.plugin(mongooseLeanVirtuals);
module.exports = model('Image', ImageSchema);
