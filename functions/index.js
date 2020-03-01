const functions = require('firebase-functions');
// const admin = require("firebase-admin");

// // Fetch the service account key JSON file contents
// const serviceAccount = require("./.user/rifa-99freelas-firebase-adminsdk-gmdt2-c75b1924e0.json");

// // Initialize the app with a service account, granting admin privileges
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://rifa-99freelas.firebaseio.com"
// });

// // As an admin, the app has access to read and write all data, regardless of Security Rules
// const db = admin.database();
// const ref = db.ref("restricted_access/secret_document");
// ref.once("value", function(snapshot) {
//   console.log(snapshot.val());
// });

// const buyersRef = ref.child( 'buyers/1' )

const { dbSetBuyers, dbGetBuyers, dbFilterBuyer, dbUpdateBuyers, dbRemoveAllBuyers } = require( './src/database/index' )

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.setBuyer = functions.https.onRequest((request, response) => {
  dbSetBuyers( {
    // id: 3, 
    email: 'alegretti@test.com',
    name: 'alegretti',
    numbers: [20,98,65]
  } )
 response.send("Add");
});

exports.deleteBuyer = functions.https.onRequest((request, response) => {
  dbRemoveAllBuyers()
 response.send("Delete");
});

