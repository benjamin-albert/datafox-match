const start = new Date().getTime();
const fs = require('fs');
const JSONStream = require('JSONStream');
const parse = require('./lib/parse');

const csvFile = fs.createReadStream('crm.csv');
parse(csvFile)
  .then(tokenizeCompanies)
  .catch( error => console.error(error) );


function tokenizeCompanies(companies) {
  // Maps a token to a map of databade records.
  const tokenMap = {};

  // Populate the map with relevant tokens.
  companies.forEach( company => {
    normalize(company).split(' ').forEach( token => {
      tokenMap[token] = tokenMap[token] || {};
    });
  });

  const dbPath = require.resolve('./db.json');
  const db = fs.createReadStream(dbPath);

  // Use a JSON stream to avoid buffering the entire
  // database into memory.
  db.pipe(JSONStream.parse('*'))
    .on('data', onRecord)
    .on('end', removeAmbiguous);

  // Tokenize all of the possible names a company
  // has in the database.
  function onRecord(record) {
    tokenize(record.name);
    record.corporate_names.forEach(tokenize);
    record.fka_names.forEach(tokenize);

    function tokenize(company) {
      normalize(company).split(' ').forEach(addToken);
    }

    function addToken(token) {
      var obj = tokenMap[token];
      if (obj) {
        obj[record.id] = record;
      }
    }
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
     normalize(company).split(' ').forEach( token => {
       var match = specificTokens[token];
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
    console.log(Object.keys(matches).length + ' out of ' + companies.length + ' companies found');

    var end = new Date().getTime();
    var time = end - start;
    console.log(`Execution time: ${time}ms`);
  }
}

function normalize(name) {
  return name.toLowerCase().replace(/[^a-z0-9 ]/gi, '');
}

function ambiguity(records) {
  return Object.keys(records).length - 1;
}
