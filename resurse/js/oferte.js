window.addEventListener('load', function () {
  async function fetchOferta() {
    const response = await fetch('/resurse/json/oferte.json');
    const data = await response.json();
    const currentOffer = data.oferte[0];

    if (currentOffer['data-finalizare'] > Date.now()) {
      updateOfertaDisplay(currentOffer);
      startCountdown(currentOffer['data-finalizare']);
    }
  }

  function updateOfertaDisplay(oferta) {
    const ofertaContainer = document.getElementById('oferta-container');
    ofertaContainer.innerHTML = `
    <h4 class="alert-heading">Oferta speciala!</h4>
    <p><strong>La fiecare produs din categoria:</strong><a href=${`/produse?categorie=${encodeURIComponent(
      oferta.categorie
    )}`}>${oferta.categorie}</a></p>
    <p><strong>Primesti o reducere de:</strong> <span class="badge badge-custom">${
      oferta.reducere
    }%</span></p>
    `;
    document.getElementById('banner-oferta').style = 'display:block;';
  }

  let timerInterval = null;
  const timerElement = document.getElementById('timer');

  function startCountdown(endTime) {
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
      const remainingTime = endTime - Date.now();

      if (remainingTime <= 0) {
        clearInterval(timerInterval);
        fetchOferta();
      } else {
        const seconds = Math.floor((remainingTime / 1000) % 60);
        const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
        const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));

        timerElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        if (remainingTime <= 1000 * 10) {
          timerElement.classList.add('warning');
        } else {
          timerElement.classList.remove('warning');
        }
      }
    }, 250);
  }

  fetchOferta();
});
