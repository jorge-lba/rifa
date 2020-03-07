const functions = require('firebase-functions');
const express = require( 'express' )
const cors = require( 'cors' )
const bodyParser = require( 'body-parser' )
const { emailS, mailOptions } = require( __dirname + '/src/model/sendEmail.js' )
const { dbSetBuyers, dbGetBuyers, dbFilterBuyer, dbUpdateBuyers, dbRemoveAllBuyers, testEmailRegistered, dbGetAllNumbersReserved, dbSetToken } = require( './src/database/index' )
const fs = require( 'fs' )
const cheerio = require( 'cheerio' )
const jsonwebtoken = require( 'jsonwebtoken' )
const { private } = require( './.user/.token.js' )

let htmlBase = __dirname + '/src/view/emailConfirm.html'

const generate = payload => (
  new Promise( resolve => {
    jsonwebtoken.verify( payload, private.key, function( err, decoded ){
      resolve( decoded )
    } )
  } )
) 

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
  $( '#confirmed' )
  .attr('href', `https://us-central1-rifa-99freelas.cloudfunctions.net/app/buyer/confirmed?id=${ data.token }`)
  $( '#reject' )
  .attr('href', `https://us-central1-rifa-99freelas.cloudfunctions.net/app/buyer/reject?id=${ data.token }`)

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

  const resToken = await dbSetToken( {
    email,
    name,
    numbers
  } )

  const options = mailOptions
  options.to = email
  options.html = '<!DOCTYPE html><html lang="pt-br">' + await htmlEmail( { email, numbers, token: resToken.token} ) + "</html>" 

  emailS.send( options )

} )

app.post( '/buyer/filter', async ( req, res ) => {
  const result = await dbFilterBuyer( req.body.email )
  res.send( result )
} )

app.get( '/buyer/confirmed', async ( req, res ) => {

  const token = req.query.id

  const data = await generate( token )

  const { userEmail:email , userNumbers:numbers } = data
  const test = await testEmailRegistered( email )
  const dateCurrent = Math.floor(Date.now() / 1000)

  if( dateCurrent < data.exp ){
    if ( !test  ){
      res.send( `Usuário Não Registrado - E-mail: ${ email }` )
    }else{
      dbUpdateBuyers( email, { numbers, state: 'confirmed' } )
      res.send( `Confirmado - E-mail: ${ email }, Numbers: ${ numbers }` )
    }
  }else{
    res.send( 'Chave expirou!' )
  }

  res.send( 'Login ou Senha Incorretos!' )
  
} )
 
app.get( '/buyer/reject', async ( req, res ) => {
  const token = req.query.id

  const data = await generate( token )

  const { userEmail:email , userNumbers:numbers } = data
  const test = await testEmailRegistered( email )
  
  const dateCurrent = Math.floor(Date.now() / 1000)

  if( dateCurrent < data.exp ){
    if ( !test  ){
      res.send( `Usuário Não Registrado - E-mail: ${ email }` )
    }else{
      console.log( numbers )
      dbUpdateBuyers( email, { numbers, state: 'rejected' } )
      res.send( `Rejeitado - E-mail: ${ email }, Numbers: ${ numbers }` )
    }
  }else{
    res.send( 'Chave expirou!' )
  }

} )

exports.app = functions.https.onRequest( app ) 
