const admin = require('firebase-admin');
const serviceAccount = require('../path/to/your-firebase-service-account.json'); // download from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
