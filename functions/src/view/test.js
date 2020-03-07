const fs = require( 'fs' )
const cheerio = require( 'cheerio' )
let htmlBase = __dirname + '/emailConfirm.html'


const baseEmail = async ( link ) => {
  const html = await fs.readFileSync( link, 'utf8',( err, data) => data)
  const base = cheerio.load( html )
  return base
}

const htmlEmail = async ( data, html = htmlBase ) => {
  const $ = await baseEmail( html )
  $( '#email' ).text( data.email ) 
  $( '#numbers' ).text( (`${data.numbers}`).replace( /,/gm, ', ' ) )

  console.log( $('*').html() )
}

const object = {
  email: 'jorge@test.com',
  numbers: []
}

object.numbers.push(0)
object.numbers.push(15)
object.numbers.push(39)

htmlEmail( object )