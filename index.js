const start = new Date().getTime();
const fs = require('fs');
const JSONStream = require('JSONStream');
const parse = require('./lib/parse');

var csvFile = fs.createReadStream('crm.csv');
parse(csvFile).then(tokenizeCompanies);

function normalize(name) {
  return name.toLowerCase().replace(/[^a-z0-9 ]/gi, '');
}

function ambiguity(records) {
  return Object.keys(records).length - 1;
}

function tokenizeCompanies(companies) {
  // Maps a token to a map of databade records.
  var tokenMap = {};

  companies.forEach( company => {
    normalize(company).split(' ').forEach( token => {
      tokenMap[token] = tokenMap[token] || {};
    });
  });

  var dbPath = require.resolve('./db.json');
  var db = fs.createReadStream(dbPath);

  db.pipe(JSONStream.parse('*'))
    .on('data', onRecord)
    .on('end', removeAmbiguous);

  function onRecord(record) {
    function addToken(token) {
      var obj = tokenMap[token];
      if (obj) {
        obj[record.id] = record;
      }
    }

    function tokenize(company) {
      normalize(company).split(' ').forEach(addToken);
    }

    tokenize(record.name);
    record.corporate_names.forEach(tokenize);
    record.fka_names.forEach(tokenize);
  }

  function removeAmbiguous() {
    var specificTokens = {};
    for (var token in tokenMap) {
      var obj = tokenMap[token];
      var ambig = ambiguity(obj);

      if (ambig < 8 && ambig > -1) {
        specificTokens[token] = Object.keys(obj);
      }
    }

    match(specificTokens);
  }

  function match(specificTokens) {
    var matches = {};
    companies.forEach( company => {
     normalize(company).split(' ').forEach( word => {
       var match = specificTokens[word];
       if (match) {
         matches[company] = match;
       }
     });
    });

    printResults(matches);
  }

  function printResults(matches) {
    console.log(matches);
    console.log('----------------');
    console.log('Number of matches: ' + Object.keys(matches).length);

    var end = new Date().getTime();
    var time = end - start;
    console.log(`Execution time: ${time}ms`);
  }
}
