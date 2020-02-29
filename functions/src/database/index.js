const lowdb = require( 'lowdb' )
const FileSync = require( 'lowdb/adapters/FileSync' )

const adapter = new FileSync( __dirname + '/database.json' )
const database = lowdb( adapter )

database.defaults({
    buyers: [],
    requests: []
}).write()

const dbSetBuyers = ( optionsObject ) => {
    if( !Object.keys( optionsObject )[0] ) return { error: 'Object Undefined' }

    try {
        if( !optionsObject.id )
            optionsObject.id = database.get( 'buyers' ).value().length
    
        if( !optionsObject.date )
            optionsObject.date = new Date
    
        const { id, email, name, numbers, date } =  optionsObject
    
        database.get( 'buyers' ).push( {
            id, email, name, numbers, date
        } ).write()  
        
        return { msg: 'Buyer successfully added' }
    } catch (error) {
        console.log( error )
        return { error }
    }
}

console.log(dbSetBuyers( {
    email: 'jorgeshawee@gmail.com',
    name: 'Jorge Alegretti',
    numbers: [ 12, 45, 423]
} ))