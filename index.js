// Client code
const ZongJi		= require('zongji');
const mysql			= require('mysql');
const dotenv 		= require('dotenv').config()
const _dbhostname_	= process.env.DB_HOST;
const _dbusername_  = process.env.DB_USERNAME;
const _dbpassword_ 	= process.env.DB_PASSWORD;
const dbName		= process.env.DB_DATABASE;

var zongji = new ZongJi({
  host     	: _dbhostname_,
  user     	: _dbusername_,
  password	: _dbpassword_,
  //debug		: true
});
var connection = mysql.createConnection({
  host     : _dbhostname_,
  user     : _dbusername_,
  password : _dbpassword_,
  database : dbName
});
const tables = process.env.DB_TABLES.split(",");
	zongji.on('binlog', function(evt) {
		if(evt.query!='BEGIN'){
			connection.connect();
			qry = process.env.DB_QRY;
			connection.query(qry, function (error, results, fields) {
				if (error) throw error;
				console.log(results);
			});
			connection.end();
			
		}
	  //evt.dump();
	});
	zongji.start({
		includeSchema : { dbName : tables},
		includeEvents: ['query'],
		startAtEnd : true
	});
process.on('SIGINT', function() {
  console.log('Got SIGINT.');
  zongji.stop();
  process.exit();
});