const lowdb = require( 'lowdb' )
const FileSync = require( 'lowdb/adapters/FileSync' )

const adapter = new FileSync( __dirname + '/database.json' )
const db = lowdb( adapter )

db.defaults({
    buyers: [],
    requests: []
}).write()

const testNumbers = ( current, next ) => {
    const result = []
    next.forEach( ( number, index ) => {
      if( current.indexOf( number ) === -1 ) result.push( number )
    } )
    const res = [ ...current, ...result ]
    return res
}

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

const dbUpdateBuyers = ( buyerData, update, database = db ) => {
    const buyer = database.get( 'buyers' ).find( buyerData )
    const [ ...updateElement ] = Object.keys( update )

    updateElement.forEach( element => {
        console.log( update[ element ] )
        if( element === 'id' ) return
        element === 'numbers'
            ? buyer.update( 'numbers', res => testNumbers( res, update[ element ] ) ).write()
            : buyer.update( element, res => update[ element ] || res).write()
    } )

    return "Update OK"

}

const dbRemoveAllBuyers = ( database = db ) => database.get( 'buyers' ).remove().write()
