const sgMail = require("@sendgrid/mail")
const cors = require( 'cors' )( { origin: true } )
const { configTransporter, mailOptions, url, sendgridKEY } = require( './.configEmail.js' )

sgMail.setApiKey( sendgridKEY )
const send = ( options = mailOptions ) => {
    try {
        sgMail.send(options) 
    } catch (error) {
        console.log( error )
    }
}

const emailS = { send }

module.exports = { emailS, mailOptions }