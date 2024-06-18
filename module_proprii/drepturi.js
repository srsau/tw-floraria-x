/**
 @typedef Drepturi
 @type {Object}
 @property {Symbol} vizualizareUtilizatori Dreptul de a intra pe  pagina cu tabelul de utilizatori.
 @property {Symbol} stergereUtilizatori Dreptul de a sterge un utilizator
 @property {Symbol} cumparareProduse Dreptul de a cumpara
 @property {Symbol} vizualizareGrafice Dreptul de a vizualiza graficele de vanzari
 @property {Symbol} anulareComanda
 @property {Symbol} updateazaClient Dreptul de a permite unui admin sa trimita un email update clientului
 @property {Symbol} updateazaStoc
 */

/**
 * @name module.exports.Drepturi
 * @type Drepturi
 */
const Drepturi = {
  vizualizareUtilizatori: Symbol('vizualizareUtilizatori'),
  stergereUtilizatori: Symbol('stergereUtilizatori'),
  cumparareProduse: Symbol('cumparareProduse'),
  vizualizareGrafice: Symbol('vizualizareGrafice'),
  anulareComanda: Symbol('anulareComanda'),
  updateazaClient: Symbol('updateazaClient'),
  updateazaStoc: Symbol('updateazaStoc'),
};

module.exports = Drepturi;
