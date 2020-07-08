//===================
// Puerto dinamico
//===================
process.env.PORT = process.env.PORT || 3000;

//===================
// Entorno
//===================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===================
// Coneccion a Base de Datos
//===================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//===================
// Expiracion Token
//===================

process.env.CADUCIDAD_TOKEN = '48h';

//===================
// SEDD
//===================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//===================
// CLIENT_ID GOOGLE
//===================

process.env.CLIENT_ID = process.env.CLIENT_ID || '981192872912-pn2masnbj7ugshqefpujb2aiil68hnab.apps.googleusercontent.com';