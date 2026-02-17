const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dir = './src/environments';
const targetPath = './src/environments/environment.ts';
const targetProdPath = './src/environments/environment.prod.ts';

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const envConfigFile = `export const environment = {
  production: false,
  keycloak: {
    url: '${process.env.KC_URL}',
    realm: '${process.env.KC_REALM}',
    clientId: '${process.env.KC_CLIENT_ID}'
  },
  apiUrl: '${process.env.API_URL}'
};
`;

const envConfigProdFile = `export const environment = {
  production: true,
  keycloak: {
    url: '${process.env.KC_URL}',
    realm: '${process.env.KC_REALM}',
    clientId: '${process.env.KC_CLIENT_ID}'
  },
  apiUrl: '${process.env.API_URL}'
};
`;

fs.writeFileSync(targetPath, envConfigFile);
fs.writeFileSync(targetProdPath, envConfigProdFile);

console.log(`Environment files generated at ${targetPath} and ${targetProdPath}`);
