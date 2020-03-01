const functions = require('firebase-functions');
const admin = require("firebase-admin");

// Fetch the service account key JSON file contents
const serviceAccount = require("../../.user/rifa-99freelas-firebase-adminsdk-gmdt2-c75b1924e0.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://rifa-99freelas.firebaseio.com"
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
const dbFire = admin.database();

const ref = dbFire.ref("restricted_access/secret_document");
ref.once("value", function(snapshot) {
  console.log(snapshot.val());
});

const dbBuyers = ref.child( 'buyers' )
// const db = lowdb( adapter )

const testNumbers = ( current, next ) => {
    const result = []
    next.forEach( ( number, index ) => {
      if( current.indexOf( number ) === -1 ) result.push( number )
    } )
    const res = [ ...current, ...result ]
    return res
}

const dbSetBuyers = async ( optionsObject, database = dbBuyers ) => {
    if( !Object.keys( optionsObject )[0] ) return { error: 'Object Undefined' }

    try {

        let res = []
        await database.once( 'value' ).then( async function(snapshot) {
            await snapshot.forEach( ( childSnapshot, i ) => { res.push( childSnapshot.key ) } )
        } )

        if( !optionsObject.id )
            optionsObject.id = res.length || 0

        
        if( !optionsObject.date )
            optionsObject.date = new Date
    
        const { id, email, name, numbers, date } =  optionsObject

        if( !(email && numbers[0]) ) return { error: 'Email or Numbers Undefined' }
    
        database.child( 'buyer-' + id ).set( {
            id, email, name, numbers, date
        } )  
        
        return { msg: 'Buyer successfully added' }
    } catch (error) {
        console.log( error )
        return { error }
    }
}

const dbGetBuyers = ( database = dbBuyers ) => database.get( 'buyers' ).value()
const dbFilterBuyer = ( object, database = dbBuyers ) => database.get( 'buyers' ).filter( object ).value() 

const dbUpdateBuyers = ( buyerData, update, database = dbBuyers ) => {
    const buyer = database.get( 'buyers' ).find( buyerData )
    const [ ...updateElement ] = Object.keys( update )

    updateElement.forEach( element => {
        console.log( update[ element ] )
        if( element === 'id' ) return
        element === 'numbers'
            ? buyer.update( 'numbers', res => testNumbers( res, update[ element ] ) )
            : buyer.update( element, res => update[ element ] || res)
    } )

    return "Update OK"

}

const dbRemoveAllBuyers = ( database = dbBuyers ) => database.remove()

module.exports = { dbSetBuyers, dbGetBuyers, dbFilterBuyer, dbUpdateBuyers, dbRemoveAllBuyers }
