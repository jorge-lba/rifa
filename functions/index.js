const functions = require('firebase-functions');
const { dbSetBuyers, dbGetBuyers, dbFilterBuyer, dbUpdateBuyers, dbRemoveAllBuyers } = require( './src/database/index' )

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

dbSetBuyers( {
    email: 'Jorge@gmail.com',
    name: 'Jorge',
    numbers: [15, 56, 90]
} )
