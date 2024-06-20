const AccesBD = require('../accesbd');
const { getConfig } = require('../produse_db');

async function renderComparaPage(req, res) {
  let prod1Id = req.params.prod1;
  let prod2Id = req.params.prod2;

  const [prod1Details, prod2Details] = await Promise.all([
    AccesBD.getInstanta().selectAsync(
      getConfig({
        campuri: ['*'],
        conditiiAnd: [`id=${prod1Id}`],
      })
    ),
    AccesBD.getInstanta().selectAsync(
      getConfig({
        campuri: ['*'],
        conditiiAnd: [`id=${prod2Id}`],
      })
    ),
  ]);

  res.render('pagini/compara.ejs', {
    prod1Details: prod1Details.rows[0],
    prod2Details: prod2Details.rows[0],
  });
}

module.exports = { renderComparaPage };
