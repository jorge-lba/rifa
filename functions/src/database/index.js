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

const ref = dbFire.ref("rifa");
// ref.once("value", function(snapshot) {
//   console.log(snapshot.val());
// });

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

const calcularFuso = (data, offset) => {
    const milisegundos_com_utc = data.getTime() + (data.getTimezoneOffset() * 60000);
    return new Date(milisegundos_com_utc + (3600000 * offset));
}

const testEmailRegistered = async ( email, database = dbBuyers ) => {
    let buyers = []
    await database.once( 'value' ).then( async function(snapshot) {
        await snapshot.forEach( ( childSnapshot, i ) => { buyers.push( childSnapshot ) } )
    } )
    buyers = buyers.map( buyer => { 
        const { ...elements } = buyer.val()
        return elements
    } )

    const emails = buyers.map( buyer => buyer.email === email ? true : false ).reduce( ( current, next ) => current || next )
    
    return emails
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
            optionsObject.date = calcularFuso( new Date(), -3 )
    
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

const dbGetBuyers = async ( database = dbBuyers ) => {
    const res = [];
    await database.once( 'value').then( async function(snapshot) {
        await snapshot.forEach( ( childSnapshot, i ) => { res.push( childSnapshot.val() ) } )
    } )
    console.log( res )
    return res
}
const dbFilterBuyer = async ( object, database = dbBuyers ) => {
  const buyers = await dbGetBuyers( database ) 
  const resBuyers = buyers.map( buyer => {
    const buyerRes = { ...buyer }
    return buyerRes.email === object 
        ? buyerRes
        : false
  } )
    return resBuyers.filter( Boolean )
}


const dbUpdateBuyers = ( buyerData, update, database = dbBuyers ) => {
    const buyer = database.once( 'value' ).then( buyerData => buyerData )
    const [ ...updateElement ] = Object.keys( update )
    update.date = calcularFuso( new Date(), -3 )

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

module.exports = { dbSetBuyers, dbGetBuyers, dbFilterBuyer, dbUpdateBuyers, dbRemoveAllBuyers, testEmailRegistered }
