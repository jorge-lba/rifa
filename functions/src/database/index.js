const lowdb = require( 'lowdb' )
const FileAsync = require( 'lowdb/adapters/FileAsync' )

const adapter = new FileAsync( __dirname + '/database.json' )
const database = lowdb( adapter )