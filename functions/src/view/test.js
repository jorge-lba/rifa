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
  $( '#email' ).text( 'test' ) 
  $( '#numbers' ).text( [20,69,87] )

  console.log( $("#content").html() )
}

htmlEmail(  )