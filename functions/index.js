const functions = require('firebase-functions');
const express = require( 'express' )
const cors = require( 'cors' )
const bodyParser = require( 'body-parser' )
const { emailS, mailOptions } = require( __dirname + '/src/model/sendEmail.js' )
const { dbSetBuyers, dbGetBuyers, dbFilterBuyer, dbUpdateBuyers, dbRemoveAllBuyers, testEmailRegistered, dbGetAllNumbersReserved } = require( './src/database/index' )
const fs = require( 'fs' )
const cheerio = require( 'cheerio' )
let htmlBase = __dirname + '/src/view/emailConfirm.html'


const baseEmail = async ( link ) => {
  const html = await fs.readFileSync( link, 'utf8',( err, data) => data)
  const base = cheerio.load( html )
  return base
}

const htmlEmail = async ( data, html = htmlBase ) => {
  const $ = await baseEmail( html )
  console.log( data )
  $( '#email' ).text( data.email ) 
  $( '#numbers' ).text( (`${data.numbers}`).replace( /,/gm, ', ' ) )

  return $('*').html()
}

const app = express()


app.use( cors() )
app.use(bodyParser.urlencoded({
  extended: true
}))

app.get( '/buyer/numbers-reserved', async ( req, res ) => {
  const numbers = await dbGetAllNumbersReserved()
  res.json( {numbers} )
} )

app.post( '/buyer/add', async ( req, res ) => {
  const { email, name, numbers } = req.body
  const test = await testEmailRegistered( email )
  if ( test  ){
    res.send( `Usuário Já Cadastrado - E-mail: ${ email }, Numbers: ${ numbers }` )
    dbUpdateBuyers( email,  { name, numbers, state: 'pending' } )
  }else{
    dbSetBuyers( { email, name, numbers, state: 'pending' } )
    res.send( `Reserva Efetuada - Nome: ${ name }, E-mail: ${ email }, Numbers: ${ numbers }` )
  }

  const options = mailOptions
  options.to = email
  options.html = '<!DOCTYPE html><html lang="pt-br">' + await htmlEmail( { email, numbers } ) + "</html>" 

  emailS.send( options )

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
    dbUpdateBuyers( email, { numbers, state: 'rejected' } )
    res.send( `Rejeitado - Nome: ${ name }, E-mail: ${ email }, Numbers: ${ numbers }` )
  }
} )

exports.app = functions.https.onRequest( app ) 
