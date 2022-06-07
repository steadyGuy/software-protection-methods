module.exports = () => {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let i = 0; i <= 25; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}