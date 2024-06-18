const AccesBD = require('./accesbd');

const configObiectDefault = { tabel: 'flori' };
const getConfig = (obiect = {}) => ({ ...configObiectDefault, ...obiect });

const getAllFlowers = async () => {
  let result;
  const config = getConfig({
    campuri: ['*'],
  });

  result = await AccesBD.getInstanta().selectAsync(config);

  return result.rows;
};

const getCategories = async () => {
  let result;
  const config = getConfig({
    campuri: ['distinct categorie'],
  });
  result = await AccesBD.getInstanta().selectAsync(config);

  return result.rows;
};

const getCategory = async (categorie) => {
  let result;
  const config = getConfig({
    campuri: ['*'],
    conditiiAnd: [`categorie='${categorie}'`],
  });

  result = await AccesBD.getInstanta().selectAsync(config);

  return result.rows;
};

const getProductDetails = async (productId) => {
  let result;
  const config = getConfig({
    campuri: ['*'],
    conditiiAnd: [`id='${productId}'`],
  });

  result = await AccesBD.getInstanta().selectAsync(config);

  return result.rows;
};

const getCompozitii = async () => {
  let result;

  const config = getConfig({
    campuri: ['distinct unnest(compozitie_buchet)'],
    conditiiAnd: ['compozitie_buchet is not null'],
  });

  result = await AccesBD.getInstanta().selectAsync(config);

  return result.rows.map((element) => element.unnest);
};

const getCategoriesOptions = async () => {
  const categorii = await getCategories();
  const categoriiArr = categorii.map((c) => ({
    href: encodeURIComponent(c.categorie),
    text: c.categorie,
  }));
  return categoriiArr;
};

module.exports = {
  getAllFlowers,
  getCategories,
  getCategory,
  getProductDetails,
  getCompozitii,
  getCategoriesOptions,
};
