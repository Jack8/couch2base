//node couch2mongo.js basename

var argv = process.argv.splice(2);

var dbname = argv[0];

var cradle = require("cradle");
var connection = new(cradle.Connection)("localhost", 5984);
var db = connection.database(dbname);

var mongodb = require("mongodb"),
    mongoserver = new mongodb.Server("127.0.0.1", 27017, {});
    db_mongo = new mongodb.Db('test', mongoserver, {});
var doc;


db.temporaryView({
	map: function (doc) {
		emit(null,doc);
		}
	}, function (err, res) {

	//Polaczenie z mongo
	db_mongo.open(function(err, db) {
	db_mongo.dropDatabase(function(err, result) {
	db_mongo.collection(dbname, function(err, collection) {
      	//Czyszczenie kolekcji
      	collection.remove({}, function(err, result) {

	//Zapisywanie z coucha do mongo
	res.forEach(function (row) {
		doc = {"name" : row.name, "artist" : row.artist, "length" : row.length,"release" : row.release}
		collection.insert(doc);
	    	});

	//Wyswietlanie z bazy mongo
        collection.count(function(err, count) {
          console.log("There are " + count + " records in the test collection. Here they are:");

          collection.find(function(err, cursor) {
            cursor.each(function(err, item) {
              if(item != null) {
                console.dir(item);
                //console.log("created at " + new Date(item._id.generationTime) + "\n")
              }
              //Koniec
              if(item == null) {
              	//Kasowanie kolekcji
                //collection.drop(function(err, collection) {db_mongo.close();});
		//Rozlaczenie
		db_mongo.close();
              	}
            });
          });
        });
      });
    });
  });
});
});

