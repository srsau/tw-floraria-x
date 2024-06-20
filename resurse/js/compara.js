window.addEventListener('DOMContentLoaded', function () {
  if (
    !(
      window.location.pathname.startsWith('/produse') ||
      window.location.pathname.startsWith('/produs')
    )
  ) {
    return;
  }

  // etapa_6: bonus comparator
  const container = document.createElement('div');
  container.id = 'container-comparare';
  container.style.display = 'none';

  document.body.appendChild(container);

  const buttons = document.querySelectorAll('[id^="compara-produs-"]');

  buttons.forEach(function (button) {
    button.addEventListener('click', function (e) {
      const prodJSON = button.getAttribute('data-prod');
      const prod = JSON.parse(prodJSON);
      const { pret, rezistenta_zile, livrare_azi } = prod;
      const details = {
        pret: pret,
        rezistenta_zile: rezistenta_zile,
        livrare_azi: livrare_azi,
        nume: prod.nume,
        id: prod.id,
      };
      const existentDetails = localStorage.getItem('prodDetails')
        ? JSON.parse(localStorage.getItem('prodDetails'))
        : [];

      if (existentDetails.length >= 2) {
        return;
      }
      const newDetails = [
        ...(Array.isArray(existentDetails) ? existentDetails : []),
        details,
      ];

      localStorage.setItem('prodDetails', JSON.stringify(newDetails));
      updateCompare();
      refreshButtons();
    });
  });

  function updateCompare() {
    const produseJSON = localStorage.getItem('prodDetails');
    if (!produseJSON) return;

    const produse = JSON.parse(produseJSON);
    const container = document.getElementById('container-comparare');

    if (produse.length > 0) {
      container.style.display = 'flex';
    } else {
      container.style.display = 'none';
    }
    container.innerHTML = '';
    const produseComparator = [];
    for (let i = 0; i < produse.length; i++) {
      if (i >= 2) {
        return;
      }
      const produs = produse[i];
      produseComparator.push(produs.id);
      const detailsHTML = `
      <div class="mx-2">
          <div>
              <h5 class="card-title d-flex justify-content-between align-items-center">
                  ${produs.nume}
                   <span class="delete-icon" id="sterge-compare-${produs.id}">
                      <i class="fas fa-trash-alt" id=${produs.id}></i>
                  </span>
              </h5>
              <ul class="list-group list-group-flush">
                  <li class="list-group-item">Price: ${produs.pret}</li>
                  <li class="list-group-item">Resistance Days: ${produs.rezistenta_zile}</li>
                  <li class="list-group-item">Delivery Today: ${produs.livrare_azi}</li>
              </ul>
          </div>
      </div>
  </div> `;
      container.innerHTML += detailsHTML;
    }
    if (produseComparator.length === 2) {
      container.innerHTML += `<a class="btn btn-primary text-white" href="/compara/${produseComparator[0]}/${produseComparator[1]}" style="align-self:center;" >Afiseaza</a>`;
    }

    setTimeout(() => {
      document.querySelectorAll('[id^="sterge-compare-"]').forEach((icon) => {
        console.log('a');
        icon.addEventListener('click', function (e) {
          let produseJSON = localStorage.getItem('prodDetails');
          let produse = produseJSON ? JSON.parse(produseJSON) : [];
          produse = produse.filter((p) => {
            return p.id.toString() !== e.target.id;
          });

          localStorage.setItem('prodDetails', JSON.stringify(produse));

          updateCompare();
          refreshButtons();
        });
      });
    }, 200);
  }

  function refreshButtons() {
    const buttons = document.querySelectorAll('[id^="compara-produs-"]');

    buttons.forEach(function (button) {
      const id = button.id.split('-')[2];

      let produseJSON = localStorage.getItem('prodDetails');
      let produse = produseJSON ? JSON.parse(produseJSON) : [];

      const found = produse.some((produs) => produs.id === +id);

      if (found) {
        button.disabled = true;
        button.parentNode.title = 'Aveti deja acest produs in comparator!';
      } else {
        button.disabled = false;
        button.parentNode.title = '';
      }
      if (!found && produse.length === 2) {
        button.disabled = true;
        button.parentNode.title = 'Aveti deja doua produse in comparator!';
      }
    });
  }

  updateCompare();
  refreshButtons();
});
