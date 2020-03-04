const nodemailer = require( 'nodemailer' )
const cors = require( 'cors' )( { origin: true } )
const { configTransporter, mailOptions, url } = require( './.configEmail.js' )

const transporter = nodemailer.createTransport( configTransporter )
const send = ( options = mailOptions ) => {
    transporter.sendMail( options, (err, res) => {
        if (err) reject(err);
        else resolve(res);
        transporter.close();
    } )
}

const emailS = { send }

module.exports = { emailS, mailOptions }