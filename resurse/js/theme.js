const setColors = (colors) => {
  for (const color in colors) {
    document.body.style.setProperty(color, colors[color]);
  }
};

const setLightColors = () => {
  setColors(lightModeColors);
};

const setDarkColors = () => {
  setColors(darkModeColors);
};

window.addEventListener('load', function () {
  const currentTheme = localStorage.getItem('theme');
  const themeToggle = document.getElementById('themeToggle');

  const lightContent = '<i class="fas fa-sun"></i>';
  const darkContent = '<i class="fas fa-moon"></i>';

  if (currentTheme) {
    document.body.classList.add(currentTheme);
    if (currentTheme === 'dark-theme') {
      themeToggle.innerHTML = darkContent;
      setDarkColors();
    } else {
      themeToggle.innerHTML = lightContent;
      setLightColors();
    }
  } else {
    document.body.classList.add('light-theme');
  }

  themeToggle.addEventListener('click', () => {
    const isDarkMode = document.body.classList.contains('dark-theme');

    if (isDarkMode) {
      setLightColors();
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      localStorage.setItem('theme', 'light-theme');
      themeToggle.innerHTML = lightContent;
    } else {
      setDarkColors();
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark-theme');
      themeToggle.innerHTML = darkContent;
    }

    // const newTheme = isDarkMode ? 'light-theme' : 'dark-theme';
    // document.body.classList.toggle('dark-theme');
    // themeToggle.innerHTML = isDarkMode ? darkContent : lightContent;

    // const theme = isDarkMode ? 'dark-theme' : 'light-theme';
    // localStorage.setItem('theme', theme);
  });
});
