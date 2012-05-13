//node couch2json.js basename
//node couch2json.js basename >> output.json

var argv = process.argv.splice(2);

var dbname = argv[0];

var cradle = require("cradle");
var connection = new(cradle.Connection)("localhost", 5984);
var db = connection.database(dbname);

db.temporaryView({
      map: function (doc) {
        emit(null,doc);
      }
    }, function (err, res) {

	var i = 0, przecinek = ',';
	console.log('{\n"docs": [');

	res.forEach(function (row) {
	i = i+1;
	if(i == res.length){
	przecinek = '';
	}
	console.log('\t{\n\t "name" : "'+row.name+'",\n\t'+' "artist" : "'+row.artist+'",\n\t'+' "length" : "'+row.length+'",\n\t'+' "release" : "'+row.release+'"\n\t}'+przecinek);
    });
console.log('\t]\n}');
  });
