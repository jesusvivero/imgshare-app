const path = require('path');
const fse = require('fs-extra');
const md5 = require('md5'); // para convertir en hash

const { randomText } = require('../helpers/libs');
const { ImageModel, CommentModel } = require('../models');

const controller = {}

controller.index = async (req, res) => {
  const viewModel = { image: {}, comments: {} };

  /*const image = await ImageModel.findOne({ filename: { $regex: req.params.image_id } }).lean({ virtuals: true }); // se usa regex para expresion regular y el filename contiene la extensión y así buscamos el nombre sin incluir la extension
  //console.log(image);*/
  const image = await ImageModel.findOne({ filename: { $regex: req.params.image_id } });

  if (image) {
    image.views = image.views + 1;
    await image.save();
    viewModel.image = image;
    const comments = await CommentModel.find({ image_id: image._id });
    viewModel.comments = comments;
    res.render('image', viewModel);
  } else {
    res.redirect('/');
  }
}

controller.create = (req, res) => {
  const saveImage = async () => {
    const imgName = randomText();
    const images = await ImageModel.find({ filename: imgName });
    if (images.length > 0) {
      saveImage();
    } else {
      const imageTempPath = req.file.path
      const ext = path.extname(req.file.originalname).toLowerCase();
      const targetPath = path.resolve(`src/public/upload/${imgName}${ext}`)

      if (ext === '.png' || ext === '.jpg' || ext === 'jpeg' || ext === '.gif') {
        await fse.rename(imageTempPath, targetPath);
        const newImage = new ImageModel({
          title: req.body.title,
          filename: imgName + ext,
          description: req.body.description,
        });
        const imageSaved = await newImage.save();
      } else {
        fse.unlink(imageTempPath);
        res.status(500).json({ error: 'Only images are allowed' });
      }
      res.redirect('/images/' + imgName);
    }
  }

  saveImage();

}

controller.like = async (req, res) => {
  const image = await ImageModel.findOne({ filename: { $regex: req.params.image_id } });
  if (image) {
    image.likes = image.likes + 1;
    await image.save();
    res.json({likes: image.likes});
  } else {
    res.status(500).json({ error: 'Internal Error' });
  }
}

controller.comment = async (req, res) => {
  const image = await ImageModel.findOne({ filename: { $regex: req.params.image_id } });

  if (image) {
    const newComment = new CommentModel(req.body);
    newComment.image_id = image._id;
    newComment.gravatar = md5(newComment.email); // convierte el email en un hash
    await newComment.save();
    res.redirect('/images/' + image.uniqueId);
  } else {
    res.redirect('/');
  }
}

controller.remove = async (req, res) => {
  const image = await ImageModel.findOne({ filename: { $regex: req.params.image_id } });
  if (image) {
    await fse.unlink(path.resolve('./src/public/upload/' + image.filename));
    await CommentModel.deleteOne({ image_id: image._id });
    await image.remove();
    res.json(true);
    //res.redirect('/');
  } else {
    res.status(500).json({ error: 'Internal Error' });
  }
}

module.exports = controller;
