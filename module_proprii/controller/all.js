const { afisareEroare } = require('../../utils/erori');

async function catchAll(req, res) {
  const locals = {};

  try {
    res.render('pagini' + req.url, locals, function (err, rezultatRandare) {
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
}

module.exports = { catchAll };
