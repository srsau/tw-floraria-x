const { getCategories } = require('./produse_db');
const fs = require('fs');
const path = require('path');

function getRandom(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

const refresh_interval = 1000 * 60 * 60 * 24 * 7;
const t2_interval = 1000 * 60 * 2; //2min

const reduceri = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

async function startOferta() {
  try {
    const categorii = await getCategories();
    const { categorie } = getRandom(categorii);

    if (categorie === obGlobal.lastCategory) {
      return await startOferta();
    }

    obGlobal.lastCategory = categorie;

    const oferta = {
      categorie,
      'data-incepere': Date.now(),
      'data-finalizare': new Date(
        new Date().getTime() + refresh_interval
      ).getTime(),
      reducere: getRandom(reduceri),
    };

    const filePath = path.join(__dirname, '../resurse/json/oferte.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');

    const data = JSON.parse(jsonData);
    data.oferte = [...data.oferte];
    data.oferte.unshift(oferta);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('eroare oferta:', error);
  }
}
async function deleteOldOffers() {
  try {
    const filePath = path.join(__dirname, '../resurse/json/oferte.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const offers = JSON.parse(jsonData);
    const filteredOffers = offers.oferte.filter(
      (offer) => offer['data-finalizare'] >= Date.now() - t2_interval
    );
    const updatedData = { oferte: filteredOffers };
    const jsonContent = JSON.stringify(updatedData, null, 2);
    fs.writeFileSync(filePath, jsonContent, 'utf8');
  } catch (error) {
    console.error('eroare oferta:', error);
  }
}

function InitOferta() {
  startOferta();
  deleteOldOffers();
  setInterval(startOferta, refresh_interval);
  setInterval(deleteOldOffers, t2_interval);
}

const getOfferData = () => {
  const filePath = path.join(__dirname, '../resurse/json/oferte.json');

  function getLatestOffer() {
    const jsonData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(jsonData).oferte[0];
  }

  let timeoutId;
  fs.watch(filePath, (eventType, filename) => {
    if (filename) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        console.log(getLatestOffer());
        obGlobal.lastOffer = getLatestOffer();
      }, 100);
    }
  });

  getLatestOffer();
};

module.exports = { InitOferta, getOfferData };
