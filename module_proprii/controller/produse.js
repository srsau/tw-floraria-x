const { getCategory, getAllFlowers, getCompozitii } = require('../produse_db');

async function renderProdusePage(req, res) {
  let rezultate = null;

  if (req.query.categorie) {
    rezultate = await getCategory(req.query.categorie);
  } else {
    rezultate = await getAllFlowers();
  }

  const compozitii = await getCompozitii();

  res.render('pagini/produse.ejs', {
    ip: req.ip,
    produse: rezultate,
    compozitii,
    imagini: obGlobal.obImagini.imagini,
  });
}

module.exports = { renderProdusePage };
