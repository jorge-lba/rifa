const lowdb = require( 'lowdb' )
const FileSync = require( 'lowdb/adapters/FileSync' )

const adapter = new FileSync( __dirname + '/database.json' )
const db = lowdb( adapter )

db.defaults({
    buyers: [],
    requests: []
}).write()

const dbSetBuyers = ( optionsObject, database = db ) => {
    if( !Object.keys( optionsObject )[0] ) return { error: 'Object Undefined' }

    try {
        if( !optionsObject.id )
            optionsObject.id = database.get( 'buyers' ).value().length
    
        if( !optionsObject.date )
            optionsObject.date = new Date
    
        const { id, email, name, numbers, date } =  optionsObject

        if( !(email && numbers[0]) ) return { error: 'Email or Numbers Undefined' }
    
        database.get( 'buyers' ).push( {
            id, email, name, numbers, date
        } ).write()  
        
        return { msg: 'Buyer successfully added' }
    } catch (error) {
        console.log( error )
        return { error }
    }
}

const dbGetBuyers = ( database = db ) => database.get( 'buyers' ).value()
const dbFilterBuyer = ( object, database = db ) => database.get( 'buyers' ).filter( object ).value() 

const dbUpadateBuyers = ( optionsObject ) => {

}

// console.log(dbSetBuyers( {
//     email: 'jorgeshawee@gmail.com',
//     name: 'Jorge Alegretti',
//     numbers: [12,15,18]
// } ))

// console.log( dbGetBuyers( ) )
console.log( dbFilterBuyer( {
    id: 2,
    email: 'jorgeshawee@gmail.com',
    name: 'Jorge Alegretti'
}) )