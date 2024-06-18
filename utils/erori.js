const fs = require('fs');
const path = require('path');

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
    path.join(__dirname, '../resurse/json/erori.json')
  );

  obGlobal.obErori = JSON.parse(continut);

  for (let eroare of obGlobal.obErori.info_erori) {
    eroare.imagine = path.join(obGlobal.obErori.cale_baza, eroare.imagine);
  }

  let err_def = obGlobal.obErori.eroare_default;

  err_def.imagine = path.join(obGlobal.obErori.cale_baza, err_def.imagine);
}

module.exports = { afisareEroare, initError };
