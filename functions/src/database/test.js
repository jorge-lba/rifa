const { dbGetAllNumbersReserved, dbRemoveAllBuyers, dbSetToken } = require( './index.js' )
const { emailS, mailOptions } = require('../model/sendEmail.js' )
const jsonwebtoken = require( 'jsonwebtoken' )
const { private } = require( '../../.user/.token.js' )


const formatNumber = ( value ) => {
    const result = []
    value.forEach( number => {
        const numbers = number.toString().split('')
        const lengthNumber = numbers.length-1
        const res = [ ]
        for( let i = 0; i < 3; i++ ){
            numbers[ i ]
                ? res[ lengthNumber - i] = `${numbers[ i ]}`
                : res[i] = "0"
        }
        result.push( res.reduce( (current, next) => next+current ) )
    } )
    return result
}

// console.log( formatNumber( [1,23,456] ) )

const respondidop1 = ( value ) => ++value > 1 ? value-1 : value

// console.log( respondidop1(2) )

// dbGetAllNumbersReserved()
// dbRemoveAllBuyers()

// emailS.send( )

// const test = async () => {
//     const res = await dbSetToken( 
//         {
//             email: "jorgeluiz.b.alegretti@gmail.com",
//             name: "Jorge",
//             numbers: [
//               25,99,58
//             ],
//           }
//      )
    
//      console.log( res )
// }

// test()

let generate = payload => (
    new Promise( resolve => {
      jsonwebtoken.verify( payload, private.key, function( err, decoded ){
        console.log( decoded, 'key:' + private.key, 'token:'+payload )
        console.log( err )
        resolve( decoded )
      } )
    } )
  )  
  
  const res = async () => {

      const data = await generate( "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJyaWZhLW9ubGluZSIsInVzZXJJRCI6MTcsInVzZXJFbWFpbCI6ImpvcmdlbHVpei5iLmFsZWdyZXR0aUBnbWFpbC5jb20iLCJ1c2VyTnVtYmVycyI6WzI1LDk5LDU4XSwiZXhwIjoxNTgzNjEzNTgwLCJpYXQiOjE1ODM2MDk5ODB9.AXfwaGmRiHLv9RMXHGCSxXawlISc8VV7LvaCjzIEc_c" )
      console.log( data .userID)
  }

  res()
