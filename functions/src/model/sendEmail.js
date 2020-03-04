const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const cors = require( 'cors' )( { origin: true } )
const { configTransporter, mailOptions, url, sendgridKEY } = require( './.configEmail.js' )

const  transporter = nodemailer.createTransport(smtpTransport( configTransporter ))
const send = ( options = mailOptions ) => {
    transporter.sendMail( options, function(error, info){
        if(error){
           console.log(error.message);
        }   
    })
}

const emailS = { send }

module.exports = { emailS, mailOptions }