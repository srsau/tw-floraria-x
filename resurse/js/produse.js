const getNumeElement = () => document.getElementById('inp-nume');
const getPretElement = () => document.getElementById('inp-pret');
const getCuloarePredElement = () => document.getElementById('inp-culoare-pred');
const getLivrareAstaziElement = () => document.getElementsByName('gr_rad');
const getTipProdusElements = () =>
  document.querySelectorAll('input[name="tip_produs"]');
const getDescriereElement = () => document.getElementById('inp-desc');
const getSelect = () => document.getElementById('select-simplu');
const getSelectMultilu = () => document.getElementById('select-multiplu');

const getInputValues = () => {
  var nume = getNumeElement().value.toLowerCase().trim();

  if (!nume) {
    alert('Numele este obligatoriu!');
    return;
  }

  var pret = parseInt(getPretElement().value);

  var culoarePredominanta = getCuloarePredElement().value.toLowerCase().trim();
  console.log({ culoarePredominanta });
  if (!culoarePredominanta || !['mov', 'rosu'].includes(culoarePredominanta)) {
    culoarePredominanta = null;
    // return;
  }
  console.log({ culoarePredominanta });

  var livrareAstaziElement = getLivrareAstaziElement();
  let livrareAstazi;
  for (let rad of livrareAstaziElement) {
    if (rad.checked) {
      livrareAstazi = rad.value;
      break;
    }
  }

  const tipProdusInput = getTipProdusElements();
  const tipProdus = Array.from(tipProdusInput)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  var desc = getDescriereElement().value.toLowerCase().trim();
  if (!desc) {
    alert('Descrierea este obligatorie!');
    return;
  }

  const rezistentaZile = parseInt(getSelect().value);

  const selectMultiplu = getSelectMultilu();
  const selectedOptions = Array.from(selectMultiplu.selectedOptions).map(
    (option) => option.value
  );

  return {
    tipProdus,
    desc,
    nume,
    pret,
    livrareAstazi: livrareAstazi ? livrareAstazi.toLowerCase() : null,
    culoarePredominanta,
    rezistentaZile: rezistentaZile || null,
    selectedOptions,
  };
};

window.addEventListener('load', function () {
  // todo mem last page display it in main page

  // task card
  const runAnimation = () => {
    const cards = document.querySelectorAll('.card');
    const t = 100;
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = 1;
        card.style.transition = 'opacity 0.5s';
      }, index * t);
    });
  };
  runAnimation();

  getDescriereElement().addEventListener('input', function () {
    const textarea = getDescriereElement();
    if (textarea.value.trim() !== '') {
      textarea.classList.remove('is-invalid');
    } else {
      textarea.classList.add('is-invalid');
    }
  });

  document.getElementById('inp-pret').onchange = function () {
    document.getElementById('infoRange').innerHTML = `(${this.value})`;
  };

  document.getElementById('filtrare').onclick = function () {
    const inputValues = getInputValues();

    var produse = document.getElementsByClassName('produs');
    for (let produs of produse) {
      const getText = (className) => {
        return produs
          .getElementsByClassName(className)[0]
          .innerHTML.toLowerCase()
          .trim();
      };

      const nume = getText('val-nume');
      const pret = parseInt(getText('val-pret'));
      const culoare = getText('val-culoare');
      const livrareAstazi = getText('val-livrareAstazi');
      const tipProdus = getText('val-tipProdus');

      const desc = getText('val-desc');
      const textarea = getDescriereElement();
      if (textarea.value.trim() === '') {
        textarea.classList.add('is-invalid');
      } else {
        textarea.classList.remove('is-invalid');
      }

      const rezistentaZile = parseInt(getText('val-rezistentaZile'));
      const compozitie = getText('val-compozitie')
        .split(',')
        .map((el) => el.trim());
      //   const categorie = getText('val-categorie');
      //   const date = getText('val-date');

      let condLivrare =
        inputValues.livrareAstazi === null
          ? true
          : livrareAstazi === inputValues.livrareAstazi;

      let condRezZile =
        inputValues.rezistentaZile === null
          ? true
          : rezistentaZile === inputValues.rezistentaZile;

      let condCuloare =
        inputValues.culoarePredominanta === null
          ? true
          : culoare === inputValues.culoarePredominanta;

      if (
        nume.startsWith(inputValues.nume) &&
        desc.includes(inputValues.desc) &&
        pret > inputValues.pret &&
        condCuloare &&
        condLivrare &&
        condRezZile &&
        inputValues.tipProdus.includes(tipProdus) &&
        inputValues.selectedOptions.every((comp) => !compozitie.includes(comp))
      ) {
        produs.style.display = 'block';
        console.log({ produs });
        produs.parentElement.style.display = 'block';
      } else {
        produs.style.display = 'none';
        produs.parentElement.style.display = 'none';
        produs.parentElement.style.opacity = '0';
      }
    }
  };

  document.getElementById('resetare').onclick = function () {
    getNumeElement().value = '';

    const pretElement = getPretElement();
    pretElement.value = pretElement.min;

    getCuloarePredElement().value = '';

    for (let rad of getLivrareAstaziElement()) {
      rad.checked = false;
    }

    getTipProdusElements().forEach((checkbox) => {
      checkbox.checked = true;
    });

    getDescriereElement().value = '';

    getSelect().value = 'nimic';

    getSelectMultilu().value = '';

    var produse = document.getElementsByClassName('produs');
    for (let produs of produse) {
      produs.style.display = 'block';
      produs.parentElement.style.display = 'block';
    }
  };

  function sorteaza(semn) {
    var produse = document.getElementsByClassName('produs');
    let v_produse = Array.from(produse);
    v_produse.sort(function (a, b) {
      let tipProdus_a = a.getElementsByClassName('val-tipProdus')[0].innerHTML;
      let tipProdus_b = b.getElementsByClassName('val-tipProdus')[0].innerHTML;

      if (tipProdus_a == tipProdus_b) {
        let pret_a = parseInt(
          a.getElementsByClassName('val-pret')[0].innerHTML
        );
        let pret_b = parseInt(
          b.getElementsByClassName('val-pret')[0].innerHTML
        );

        return semn * (pret_a - pret_b);
      }
      return semn * tipProdus_a.localeCompare(tipProdus_b);
    });
    for (let prod of v_produse) {
      prod.parentNode.appendChild(prod);
    }
  }

  document.getElementById('sortCrescTipProdus').onclick = function () {
    console.log('sortCrescTipProdus');
    sorteaza(1);
  };
  document.getElementById('sortDescrescTipProdus').onclick = function () {
    console.log('sortDescrescTipProdus');
    sorteaza(-1);
  };

  document.getElementById('calcTotal').addEventListener('click', function () {
    const numbers = document.querySelectorAll('[class^="val-pret"]');
    const values = [];
    numbers.forEach((element) => {
      const num = parseFloat(element.textContent);
      if (!isNaN(num)) {
        values.push(num);
      }
    });

    const sum = values.reduce((acc, val) => acc + val, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    const calculContainer = document.createElement('div');
    calculContainer.innerHTML = `
      <p>Suma: ${sum}</p>
      <p>Medie: ${avg}</p>
      <p>Minim: ${min}</p>
      <p>Maxim: ${max}</p>
    `;

    calculContainer.style.position = 'fixed';
    calculContainer.style.bottom = '20px';
    calculContainer.style.left = '50%';
    calculContainer.style.transform = 'translateX(-50%)';
    calculContainer.style.backgroundColor = '#f0f0f0';
    calculContainer.style.border = '1px solid black';
    calculContainer.style.borderRadius = '5px';
    calculContainer.style.padding = '12px';

    document.body.appendChild(calculContainer);

    setTimeout(() => {
      calculContainer.remove();
    }, 2000);
  });
});

const lightModeColors = {
  '--culoare-1': '#5930fa',
  '--culoare-secundara-1': '#2f48fa',
  '--culoare-secundara-2': '#9a2ffa',
  '--culoare-secundara-3': '#2f88fa',
  '--highlight': '#dc2ffa',
  '--text': '#ffffff',
  '--white': '#ffffff',
  '--black': '#000000',
};

const darkModeColors = {
  '--culoare-1': '#2e1a7f',
  '--culoare-secundara-1': '#1823a3',
  '--culoare-secundara-2': '#6b1ca3',
  '--culoare-secundara-3': '#1c427a',
  '--highlight': '#971ca3',
  '--text': '#e0e0e0',
  '--white': '#e0e0e0',
  '--black': '#121212',
};
