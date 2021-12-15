const { ImageModel } = require('../models');

const controller = {}

controller.index = async (req, res) => {
  const images = await ImageModel.find().sort({ timestamp: -1 }).lean({virtuals: true}); // lean() le indica a mongoose que retorne un objeto simple de javascript y no objetos hidratados mongoose que son más pesados, aunque devuelven la misma información, el problema es si definimos variables virtuales en el modelo de mongoose, no son reconocidas por lean, para ellos se usa el módulo mongoose-lean-virtuals (Usado en el modelo)
  res.render('index', { images: images });
}



module.exports = controller;
