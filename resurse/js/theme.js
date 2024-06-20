const setColors = (colors) => {
  for (const color in colors) {
    document.body.style.setProperty(color, colors[color]);
  }
};

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

// etapa_6 dark

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
  });
});
