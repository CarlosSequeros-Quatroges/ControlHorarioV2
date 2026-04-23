// set-build-date.js
const fs = require("fs");
const path = require("path");
const environmentFile = path.join(
  __dirname,
  "src/environments/environment.dev.ts",
);

const buildDate = new Date()
  .toISOString()
  .toLocaleString("es-ES")
  .replace("T", " ")
  .split(".")[0];

// Lee el archivo, reemplaza la fecha y guarda
//const content = fs.readFileSync(environmentFile, 'utf-8');
//const result = content.replace(/buildDate: '.*'/`buildDate: '${buildDate}'`);

const envConfigFile = `export const environment = {
  production: true,
  buildDate: '${buildDate}'
};
`;

fs.writeFileSync(environmentFile, envConfigFile, "utf-8");
console.log(`Fecha de compilación actualizada: ${buildDate}`);
