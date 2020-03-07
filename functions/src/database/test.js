const { dbGetAllNumbersReserved, dbRemoveAllBuyers, dbSetToken } = require( './index.js' )
const { emailS, mailOptions } = require('../model/sendEmail.js' )

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

const test = async () => {
    const res = await dbSetToken( 
        {
            email: "Jorge@gmail.com",
            name: "Jorge",
            numbers: [
              25,99
            ],
          }
     )
    
     console.log( res )
}

test()