const fs = require('fs');
const path = require('path');
const sass = require('sass');

function compileazaScss(caleScss, caleCss) {
  if (!caleCss) {
    let numeFisExt = path.basename(caleScss);
    let numeFis = numeFisExt.split('.')[0];
    caleCss = numeFis + '.css';
  }

  if (!path.isAbsolute(caleScss)) {
    caleScss = path.join(obGlobal.folderScss, caleScss);
  }

  if (!path.isAbsolute(caleCss)) {
    caleCss = path.join(obGlobal.folderCss, caleCss);
  }

  let caleBackup = path.join(obGlobal.folderBackup, 'resurse/css');

  if (!fs.existsSync(caleBackup)) {
    fs.mkdirSync(caleBackup, { recursive: true });
  }

  let numeFisCss = path.basename(caleCss);
  // todo
  // if (fs.existsSync(caleCss)) {
  //   const fileName =
  //     numeFisCss.split('.')[0] +
  //     '_' +
  //     new Date().getTime() +
  //     '.' +
  //     numeFisCss.split('.')[1];
  //   fs.copyFileSync(
  //     caleCss,
  //     path.join(obGlobal.folderBackup, 'resurse/css', fileName)
  //   );
  // }
  const rez = sass.compile(caleScss, { sourceMap: true });
  fs.writeFileSync(caleCss, rez.css);
}

function initCompileazaScss() {
  const vFisiere = fs.readdirSync(obGlobal.folderScss);
  for (let numeFis of vFisiere) {
    if (path.extname(numeFis) == '.scss') {
      compileazaScss(numeFis);
    }
  }

  fs.watch(obGlobal.folderScss, function (eveniment, numeFis) {
    console.log(eveniment, ': ', numeFis);
    if (eveniment == 'change' || eveniment == 'rename') {
      let caleCompleta = path.join(obGlobal.folderScss, numeFis);
      if (fs.existsSync(caleCompleta)) {
        compileazaScss(caleCompleta);
      }
    }
  });
}

function initBackup() {
  vect_foldere = ['temp', 'backup'];

  for (let folder of vect_foldere) {
    let caleFolder = path.join(__dirname, folder);
    if (!fs.existsSync(caleFolder)) {
      fs.mkdirSync(caleFolder);
    }
  }
}

module.exports = { compileazaScss, initCompileazaScss, initBackup };
