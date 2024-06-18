const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const sass = require('sass');
const ejs = require('ejs');

function initImagini() {
  var continut = fs
    .readFileSync(path.join(__dirname, '../resurse/json/galerie.json'))
    .toString('utf-8');

  obGlobal.obImagini = JSON.parse(continut);

  let vImagini = obGlobal.obImagini.imagini;
  let caleGalerie = path.join('..', obGlobal.obImagini.cale_galerie);

  let caleAbs = path.join(__dirname, caleGalerie);
  let caleAbsMediu = path.join(__dirname, caleGalerie, 'mediu');
  let caleAbsMic = path.join(__dirname, caleGalerie, 'mic');

  if (!fs.existsSync(caleAbsMediu)) fs.mkdirSync(caleAbsMediu);
  if (!fs.existsSync(caleAbsMic)) fs.mkdirSync(caleAbsMic);

  for (let imag of vImagini) {
    [numeFis, ext] = imag['cale_fisier'].split('.');

    let caleFisAbs = path.join(caleAbs, imag['cale_fisier']);
    let caleFisMediuAbs = path.join(caleAbsMediu, numeFis + '.webp');
    let caleFisMediuMic = path.join(caleAbsMic, numeFis + '.webp');

    sharp(caleFisAbs).resize(300).toFile(caleFisMediuAbs);
    sharp(caleFisAbs).resize(200).toFile(caleFisMediuMic);

    imag.fisier_mediu = path
      .join('/', caleGalerie, 'mediu', numeFis + '.webp')
      .replace(/\\/g, '/');
    imag.fisier_mic = path
      .join('/', caleGalerie, 'mic', numeFis + '.webp')
      .replace(/\\/g, '/');

    imag['cale_fisier'] = path
      .join('/', caleGalerie, imag['cale_fisier'])
      .replace(/\\/g, '/');
  }
}

function galerieAnimata(req, res) {
  var sirScss = fs
    .readFileSync(
      path.join(__dirname, '../resurse/scss_ejs/galerie_animata.scss')
    )
    .toString('utf8');

  var varianteNr = [7, 8, 9, 11];
  var indiceAleator = Math.floor(Math.random() * varianteNr.length);
  var nrImagini = varianteNr[indiceAleator];

  rezScss = ejs.render(sirScss, { nrImagini });
  console.log(rezScss);
  var caleScss = path.join(__dirname, 'temp/galerie_animata.scss');
  fs.writeFileSync(caleScss, rezScss);
  try {
    rezCompilare = sass.compile(caleScss, { sourceMap: true });

    var caleCss = path.join(__dirname, 'temp/galerie_animata.css');
    fs.writeFileSync(caleCss, rezCompilare.css);
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(caleCss);
  } catch (err) {
    console.log(err);
    res.send('Eroare');
  }
}
module.exports = { initImagini, galerieAnimata };
