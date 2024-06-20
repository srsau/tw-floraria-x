const AccesBD = require('../accesbd');
const {
  getCategory,
  getAllFlowers,
  getCompozitii,
  getConfig,
} = require('../produse_db');

async function renderProdusePage(req, res) {
  let rezultate = null;

  // <!-- etapa_6 1 -->
  if (req.query.categorie) {
    rezultate = await getCategory(req.query.categorie);
  } else {
    rezultate = await getAllFlowers();
  }
  // etapa_6 bonus 1
  const [
    compozitiiResult,
    maxMinPretResult,
    zileResult,
    tipProdusResult,
    livrareAziResult,
    culoriPredominanteResult,
  ] = await Promise.all([
    getCompozitii(),
    AccesBD.getInstanta().selectAsync(
      getConfig({ campuri: ['MAX(pret) as maxPret, MIN(pret) as minPret'] })
    ),
    AccesBD.getInstanta().selectAsync(
      getConfig({ campuri: ['DISTINCT rezistenta_zile'] })
    ),
    AccesBD.getInstanta().selectAsync(
      getConfig({ campuri: ['DISTINCT tip_produs'] })
    ),
    AccesBD.getInstanta().selectAsync(
      getConfig({ campuri: ['DISTINCT livrare_azi'] })
    ),
    AccesBD.getInstanta().selectAsync(
      getConfig({ campuri: ['DISTINCT culoare_predominanta'] })
    ),
  ]);
  // etapa_6 bonus 1
  const compozitii = compozitiiResult;
  const { rows } = maxMinPretResult;
  const zile = zileResult;
  const tipProdus = tipProdusResult;
  const livrareAzi = livrareAziResult;
  const culoriPredominante = culoriPredominanteResult;

  res.render('pagini/produse.ejs', {
    ip: req.ip,
    produse: rezultate,
    compozitii,
    imagini: obGlobal.obImagini.imagini,
    pretMinim: rows[0].minpret,
    pretMaxim: rows[0].maxpret,
    culoriPredominante: culoriPredominante.rows.map(
      (el) => el.culoare_predominanta
    ),
    livrareAstazi: livrareAzi.rows.map((el) => (el.livrare_azi ? 'Da' : 'Nu')),
    tipProdus: tipProdus.rows.map((el) => el.tip_produs),
    optiuniZile: zile.rows.map((el) => el.rezistenta_zile),
  });
}

module.exports = { renderProdusePage };
