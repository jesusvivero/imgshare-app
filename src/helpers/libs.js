const helpers = {};

helpers.randomText = () => {
  const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let randomText = '';
  for (let i = 0; i < 6; i++){
    randomText += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return randomText;
}

module.exports = helpers;
