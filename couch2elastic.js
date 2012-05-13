//node couch2elastic.js basename
var argv = process.argv.splice(2);

var dbname = argv[0];

var cradle = require("cradle");
var connection = new(cradle.Connection)("localhost", 5984);
var db = connection.database(dbname);

ElasticSearchClient = require('elasticsearchclient');
var serverOptions = {
    host: 'localhost',
    port: 9200,
};
var elasticSearchClient = new ElasticSearchClient(serverOptions);


db.temporaryView({
      map: function (doc) {
        emit(null,doc);
      	}
    	}, function (err, res) {
		//Przepisywanie couch do commands
		var commands = []
		res.forEach(function (row) {
		commands.push({ "index" : { "_index" : dbname, "_type" : row.artist} })
		commands.push({name: row.name, length : row.length, release: row.release})
    	});
	//Przepisanie commands do elastic
	elasticSearchClient.bulk(commands, {})
            .on('data', function(data) {})
            .on('done', function(done){})
            .on('error', function(error){})
            .exec();
  });
