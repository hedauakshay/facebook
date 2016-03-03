/**
 * New node file
*/

var ejs= require('ejs');
var mysql = require('mysql');

	var pool = mysql.createPool({
		connectionLimit : 100,
	    host     		: 'localhost',
	    user     		: 'root',
	    password 		: '',
	    database 		: 'fb',
	    port	 		: 3306
	});


function fetchData(callback,sqlQuery){

	console.log(sqlQuery);
	
	console.log("\nSQL Query::"+sqlQuery);
	
	var connection=pool.getConnection(function(err, connection) {
		if(err){
			connection.release();
			console.log("ERROR: " + err.message);
			return;
		}
		// return err or result
			connection.query( sqlQuery, function(err, rows) { 

			    connection.release();

			if (err) {

			console.log(err.message);

			} else {

			console.log("DB Data:" + rows);

			callback(err, rows);

			}


			});
	});
	console.log("\nConnection closed..");
	//connection.release();
}	


exports.fetchData=fetchData;