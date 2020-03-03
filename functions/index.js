const functions = require('firebase-functions');
const express = require( 'express' )
const cors = require( 'cors' )
const bodyParser = require( 'body-parser' )

const app = express()

const { dbSetBuyers, dbGetBuyers, dbFilterBuyer, dbUpdateBuyers, dbRemoveAllBuyers, testEmailRegistered, dbGetAllNumbersReserved } = require( './src/database/index' )

app.use( cors() )
app.use(bodyParser.urlencoded({
  extended: true
}))

app.get( '/buyer/numbers-reserved', async ( req, res ) => {
  const numbers = await dbGetAllNumbersReserved()
  res.send( numbers )
} )

app.post( '/buyer/add', async ( req, res ) => {
  const { email, name, numbers } = req.body
  const test = await testEmailRegistered( email )
  if ( test  ){
    res.send( `Usuário Já Cadastrado - E-mail: ${ email }` )
  }else{
    dbSetBuyers( { email, name, numbers, state: 'pending' } )
    res.send( `Reserva Efetuada - Nome: ${ name }, E-mail: ${ email }, Numbers: ${ numbers }` )
  }

} )

app.post( '/buyer/filter', async ( req, res ) => {
  const result = await dbFilterBuyer( req.body.email )
  res.send( result )
} )

app.post( '/buyer/confirmed', async ( req, res ) => {
  const LOGIN = functions.config().someservice.login
  const PASS = functions.config().someservice.pass
  
  if( req.headers.login === LOGIN && req.headers.pass === PASS ){
    const { email, name, numbers } = req.body
    const test = await testEmailRegistered( email )
    if ( !test  ){
      res.send( `Usuário Não Registrado - E-mail: ${ email }` )
    }else{
      dbUpdateBuyers( email, { numbers, state: 'confirmed' } )
      res.send( `Confirmado - Nome: ${ name }, E-mail: ${ email }, Numbers: ${ numbers }` )
    }
  }

  res.send( 'Login ou Senha Incorretos!' )
  
} )

app.post( '/buyer/reject', async ( req, res ) => {
  const { email, name, numbers } = req.body
  const test = await testEmailRegistered( email )
  if ( !test  ){
    res.send( `Usuário Não Registrado - E-mail: ${ email }` )
  }else{
    dbUpdateBuyers( email, { numbers: [], state: 'rejected' } )
    res.send( `Rejeitado - Nome: ${ name }, E-mail: ${ email }, Numbers: ${ numbers }` )
  }
} )

exports.app = functions.https.onRequest( app ) 

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

// exports.setBuyer = functions.https.onRequest((request, response) => {
//   dbSetBuyers( {
//     // id: 3, 
//     email: 'alegretti@test.com',
//     name: 'alegretti',
//     numbers: [20,98,65]
//   } )
//  response.send("Add");
// });

// exports.getAllBuyers = functions.https.onRequest( async ( request, response )=> {
//   const res = await dbGetBuyers()
//   console.log( res )
//   response.send( res )
// } )

// exports.deleteBuyer = functions.https.onRequest((request, response) => {
//   dbRemoveAllBuyers()
//  response.send("Delete");
// });



