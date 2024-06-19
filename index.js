const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const AccesBD = require('./module_proprii/accesbd.js');
const {
  getProductDetails,
  getCategoriesOptions,
} = require('./module_proprii/produse_db.js');
const { Utilizator } = require('./module_proprii/utilizator.js');

const {
  inregistare_user,
  confirma_cod,
  logout_user,
  login_user,
} = require('./module_proprii/controller/inregistrare.js');
const { afisareEroare, initError } = require('./utils/erori.js');
const { renderProdusePage } = require('./module_proprii/controller/produse.js');
const { galerieAnimata, initImagini } = require('./utils/imagini.js');
const { initCompileazaScss, initBackup } = require('./utils/scss.js');
const { catchAll } = require('./module_proprii/controller/all.js');
const { InitOferta, getOfferData } = require('./module_proprii/oferte.js');

AccesBD.getInstanta();

// etapa_4: 12
obGlobal = {
  obErori: null,
  obImagini: null,
  folderScss: path.join(__dirname, 'resurse/scss'),
  folderCss: path.join(__dirname, 'resurse/css'),
  folderBackup: path.join(__dirname, 'backup'),
  lastCategory: '',
  lastOffer: {},
};

initBackup();
initError(); // etapa_4: 13
initImagini();
initCompileazaScss();
InitOferta();

getOfferData();
const app = express();

app.use(
  session({
    // aici se creeaza proprietatea session a requestului (pot folosi req.session)
    secret: 'abcdefg', //folosit de express session pentru criptarea id-ului de sesiune
    resave: true,
    saveUninitialized: false,
  })
);

app.use('/*', async function (req, res, next) {
  const categorii = await getCategoriesOptions();
  res.locals.categorii = categorii;
  // res.locals.optiuniMeniu = obGlobal.optiuniMeniu;
  // res.locals.Drepturi = Drepturi;
  if (req.session.utilizator) {
    req.utilizator = res.locals.utilizator = new Utilizator(
      req.session.utilizator
    );
  }
  next();
});

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// etapa_4: 2,3,4
console.log('Folder proiect: ', __dirname);
console.log('Cale fisier: ', __filename);
console.log('Director de lucru: ', process.cwd());

app.set('view engine', 'ejs');

// etapa_4: 17
app.get(new RegExp('^/resurse/[a-zA-Z0-9_/-]+/$'), function (req, res) {
  afisareEroare(res, 403);
});

app.use('/resurse', express.static(path.join(__dirname, 'resurse')));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

// etapa_4: 18
app.get('/favicon.ico', function (req, res) {
  res.sendFile(path.join(__dirname), 'resurse/ico/favicon.ico');
});

app.get('*/galerie-animata.css.map', function (req, res) {
  res.sendFile(path.join(__dirname, 'temp/galerie-animata.css.map'));
});

// etapa_4: 8
// etapa_4: 9
app.get(['/', '/home', '/index'], async function (req, res) {
  res.render('pagini/index.ejs', {
    ip: req.ip,
    imagini: obGlobal.obImagini.imagini,
    lastOffer: obGlobal.lastOffer,
  });
});
// todo: taguri html
app.get('/produs/:id', async function (req, res) {
  let details = null;
  if (req.params.id) {
    details = await getProductDetails(req.params.id);
  }
  res.render('pagini/produs.ejs', {
    ip: req.ip,
    detaliiProdus: details[0],
  });
});

app.get('/produse', renderProdusePage);

app.get('/inregistrare', async function (req, res) {
  res.render('pagini/inregistrare.ejs', {
    reactAppSrc: 'http://localhost:5173/',
  });
});

// ---------------- UTILIZATORI

app.post('/inregistrare', inregistare_user);

app.get('/cod/:username/:token', confirma_cod);

app.post('/login', login_user);

app.get('/logout', logout_user);
// --------

app.get('*/galerie-animata.css', galerieAnimata);

// etapa_4: 19
app.get('/*.ejs', function (req, res) {
  afisareEroare(res, 400);
});

app.use(express.static(path.join(__dirname, 'react-app/dist')));

app.get('/react-app', (req, res, next) => {
  if (req.headers.referer && req.headers.referer.includes('/inregistrare')) {
    next();
  } else {
    res.status(403).send('Access forbidden');
  }
  // res.sendFile(path.join(__dirname, 'react-app/dist', 'index.html'));
});

// etapa_4: 9
app.get(['/*'], catchAll);

app.listen(8000);
console.log('Serverul a pornit');
