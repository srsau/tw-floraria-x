function setCookie(name, value, days) {
  let d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  let expires = 'expires=' + d.toUTCString();
  document.cookie = name + '=' + value + ';' + expires + ';path=/';
}

function getCookie(name) {
  let nameEQ = name + '=';
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function deleteCookie(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;';
}

function deleteAllCookies() {
  document.cookie.split(';').forEach(function (c) {
    document.cookie = c
      .replace(/^ +/, '')
      .replace(/=.*/, '=;expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/');
  });
}

window.addEventListener('load', function () {
  if (!getCookie('acceptedCookies')) {
    const banner = document.getElementById('banner');
    banner.style.visibility = 'visible';
    banner.classList.add('banner-visible');
  }

  document.getElementById('ok_cookies').addEventListener('click', () => {
    document.getElementById('banner').style.display = 'none';
    setCookie('acceptedCookies', 'true', 7);
  });
});
