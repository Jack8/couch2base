//node json2couch.js input.json basename

console.time('total-time');

function usage(when) {
  var scriptName = process.argv[1].split('/').pop();
};

var argv = process.argv.splice(2);
usage(argv.length !== 2);

var filename = argv[0];
var dbname = argv[1];

var cc = require('couch-client')('http://localhost:5984/' + dbname)
, fs = require('fs');

var text = fs.readFileSync(filename, 'UTF-8');
var json = JSON.parse(text);

//Kasuje baze
//cc.request("DELETE", "/"+dbname+"/", {}, function (err, result) {console.info(result);});

//Tworzy baze
cc.request("PUT", "/"+dbname+"/", {}, function (err, result) {
//console.info(result);
	cc.request("POST", cc.uri.pathname + "/_bulk_docs", json, function(err, results) {
		if (err) {
		throw err;
		} else { 
		console.info(json.docs.length + ' records was written to database: ' + dbname);
		};
	});
});

console.timeEnd('total-time');
