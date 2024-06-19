const { afisareEroare } = require('../../utils/erori');
const { getCategoriesOptions } = require('../produse_db');
const { Utilizator } = require('../utilizator');

async function inregistare_user(req, res) {
  var username;
  var poza;
  const newUser = req.body;
  //4
  console.log('Inregistrare:', req.body);
  var utilizNou = new Utilizator();
  var eroare = '';

  utilizNou.culoare_chat = newUser.culoare;
  utilizNou.data_nasterii = newUser.dataNasterii;
  utilizNou.email = newUser.email;
  utilizNou.poza = newUser.fotografie;
  utilizNou.prenume = newUser.prenume;
  utilizNou.setareNume = newUser.nume;
  utilizNou.parola = newUser.parola;
  utilizNou.setareUsername = newUser.username;
  utilizNou.telefon = newUser.telefon;

  Utilizator.getUtilizDupaUsername(
    newUser.username,
    {},
    function (u, parametru, eroareUser) {
      if (eroareUser == -1) {
        utilizNou.salvareUtilizator();
      } else {
        eroare += 'Username deja existent';
      }
      if (eroare) {
        res.status(400).json({ error: eroare });
      } else {
        res.status(200);
      }
    }
  );
}

async function confirma_cod(req, res) {
  /*TO DO parametriCallback: cu proprietatile: request (req) si token (luat din parametrii cererii)
        setat parametriCerere pentru a verifica daca tokenul corespunde userului
    */
  console.log(req.params);

  try {
    var parametriCallback = {
      req: req,
      token: req.params.token,
    };
    Utilizator.getUtilizDupaUsername(
      req.params.username,
      parametriCallback,
      function (u, obparam) {
        let parametriCerere = {
          tabel: 'utilizatori',
          campuri: { confirmat_mail: true },
          conditiiAnd: [`id=${u.id}`],
        };
        AccesBD.getInstanta().update(
          parametriCerere,
          function (err, rezUpdate) {
            if (err || rezUpdate.rowCount == 0) {
              console.log('Cod:', err);
              afisareEroare(res, 3);
            } else {
              res.render('pagini/confirmare.ejs');
            }
          }
        );
      }
    );
  } catch (e) {
    console.log(e);
    afisareEroare(res, 2);
  }
}

async function login_user(req, res) {
  /*TO DO
        testam daca a confirmat mailul
    */
  var username;
  console.log('ceva');
  var formular = new formidable.IncomingForm();

  formular.parse(req, function (err, campuriText, campuriFisier) {
    var parametriCallback = {
      req: req,
      res: res,
      parola: campuriText.parola[0],
    };
    Utilizator.getUtilizDupaUsername(
      campuriText.username[0],
      parametriCallback,
      function (u, obparam, eroare) {
        //proceseazaUtiliz
        let parolaCriptata = Utilizator.criptareParola(obparam.parola);
        if (u.parola == parolaCriptata && u.confirmat_mail) {
          u.poza = u.poza
            ? path.join('poze_uploadate', u.username, u.poza)
            : '';
          obparam.req.session.utilizator = u;
          obparam.req.session.mesajLogin = 'Bravo! Te-ai logat!';
          obparam.res.redirect('/index');
        } else {
          console.log('Eroare logare');
          obparam.req.session.mesajLogin =
            'Date logare incorecte sau nu a fost confirmat mailul!';
          console.log(obparam.req.session);
          obparam.res.redirect('/index');
        }
      }
    );
  });
}

function logout_user(req, res) {
  req.session.destroy();
  res.locals.utilizator = null;
  res.render('pagini/logout');
}

module.exports = { inregistare_user, confirma_cod, login_user, logout_user };
