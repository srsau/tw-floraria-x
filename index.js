const express = require('express');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const sass = require('sass');
const ejs = require('ejs');

obGlobal = {
  obErori: null,
  obImagini: null,
  folderScss: path.join(__dirname, 'resurse/scss'),
  folderCss: path.join(__dirname, 'resurse/css'),
  folderBackup: path.join(__dirname, 'backup'),
};
vect_foldere = ['temp', 'backup'];

for (let folder of vect_foldere) {
  let caleFolder = path.join(__dirname, folder);
  if (!fs.existsSync(caleFolder)) {
    fs.mkdirSync(caleFolder);
  }
}
initError();
initImagini();

app = express();
console.log('Folder proiect: ', __dirname);
console.log('Cale fisier: ', __filename);
console.log('Director de lucru: ', process.cwd());

app.set('view engine', 'ejs');

app.get(new RegExp('^/resurse/[a-zA-Z0-9_/-]+/$'), function (req, res) {
  afisareEroare(res, 403);
});

app.use('/resurse', express.static(path.join(__dirname, 'resurse')));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.get(['/', '/home', '/index'], function (req, res) {
  res.render('pagini/index.ejs', {
    ip: req.ip,
    imagini: obGlobal.obImagini.imagini,
  });
});

app.get('*/galerie-animata.css', function (req, res) {
  var sirScss = fs
    .readFileSync(path.join(__dirname, 'resurse/scss_ejs/galerie_animata.scss'))
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
});

app.get('/*.ejs', function (req, res) {
  afisareEroare(res, 400);
});

app.get(['/*'], function (req, res) {
  try {
    res.render('pagini' + req.url, function (err, rezultatRandare) {
      if (err) {
        if (err.message.startsWith('Failed to lookup view')) {
          console.log('Nu a gasit pagina', req.url);
          afisareEroare(res, 404);
        }
      } else {
        res.send(rezultatRandare);
      }
    });
  } catch (err1) {
    if (err1.message.startsWith('Cannot find module')) {
      afisareEroare(res, 404);
      console.log('Nu a gasita resursa', req.url);
      return;
    }
  }
});

app.get('/favicon.ico', function (req, res) {
  res.sendFile(path.join(__dirname), 'resurse/ico/favicon.ico');
});

app.get('*/galerie-animata.css.map', function (req, res) {
  res.sendFile(path.join(__dirname, 'temp/galerie-animata.css.map'));
});

app.listen(8000);
console.log('Serverul a pornit');

function afisareEroare(res, _identificator, _titlu, _text, _imagine) {
  let eroare = obGlobal.obErori.info_erori.find(
    (el) => el.identificator === _identificator
  );
  if (!eroare) {
    eroare = obGlobal.obErori.eroare_default;
  }
  res.render('pagini/eroare.ejs', {
    titlu: _titlu || eroare.titlu,
    text: _text || eroare.text,
    imagine: _imagine || eroare.imagine,
  });
}

function initError() {
  let continut = fs.readFileSync(
    path.join(__dirname, 'resurse/json/erori.json')
  );

  obGlobal.obErori = JSON.parse(continut);

  for (let eroare of obGlobal.obErori.info_erori) {
    eroare.imagine = path.join(obGlobal.obErori.cale_baza, eroare.imagine);
  }

  let err_def = obGlobal.obErori.eroare_default;

  err_def.imagine = path.join(obGlobal.obErori.cale_baza, err_def.imagine);
}

function initImagini() {
  var continut = fs
    .readFileSync(path.join(__dirname, 'resurse/json/galerie.json'))
    .toString('utf-8');

  obGlobal.obImagini = JSON.parse(continut);
  let vImagini = obGlobal.obImagini.imagini;
  let caleGalerie = obGlobal.obImagini.cale_galerie;

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

    imag.fisier_mediu = path.join('/', caleGalerie, 'mediu', numeFis + '.webp');
    imag.fisier_mic = path.join('/', caleGalerie, 'mic', numeFis + '.webp');

    imag['cale_fisier'] = path.join('/', caleGalerie, imag['cale_fisier']);
  }
}

function compileazaScss(caleScss, caleCss) {
  if (!caleCss) {
    let numeFisExt = path.basename(caleScss);
    let numeFis = numeFisExt.split('.')[0];
    caleCss = numeFis + '.css';
  }

  if (!path.isAbsolute(caleScss)) {
    caleScss = path.join(obGlobal.folderScss, caleScss);
  }

  if (!path.isAbsolute(caleCss)) {
    caleCss = path.join(obGlobal.folderCss, caleCss);
  }

  let caleBackup = path.join(obGlobal.folderBackup, 'resurse/css');

  if (!fs.existsSync(caleBackup)) {
    fs.mkdirSync(caleBackup, { recursive: true });
  }

  let numeFisCss = path.basename(caleCss);
  if (fs.existsSync(caleCss)) {
    const fileName =
      numeFisCss.split('.')[0] +
      '_' +
      new Date().getTime() +
      '.' +
      numeFisCss.split('.')[1];
    fs.copyFileSync(
      caleCss,
      path.join(obGlobal.folderBackup, 'resurse/css', fileName)
    );
  }
  rez = sass.compile(caleScss, { sourceMap: true });
  fs.writeFileSync(caleCss, rez.css);
}

vFisiere = fs.readdirSync(obGlobal.folderScss);
for (let numeFis of vFisiere) {
  if (path.extname(numeFis) == '.scss') {
    compileazaScss(numeFis);
  }
}

fs.watch(obGlobal.folderScss, function (eveniment, numeFis) {
  console.log(eveniment, ': ', numeFis);
  if (eveniment == 'change' || eveniment == 'rename') {
    let caleCompleta = path.join(obGlobal.folderScss, numeFis);
    if (fs.existsSync(caleCompleta)) {
      compileazaScss(caleCompleta);
    }
  }
});