const fs = require('fs');
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
  var tokenMap = {};

  var db = require('./db.json');

  db.forEach(function(record) {
    function addToken(token) {
      var obj = tokenMap[token] || (tokenMap[token] = {});
      obj[record.id] = record;
    }

    function tokenize(company) {
      normalize(company).split(' ').forEach( addToken );
    }

    tokenize(record.name);
    record.corporate_names.forEach(tokenize);
    record.fka_names.forEach(tokenize);
  } );

  var uniqueTokens = {};
  for (var token in tokenMap) {
    var obj = tokenMap[token];
    if (ambiguity(obj) < 8) {
      uniqueTokens[token] = Object.keys(obj);
    }
  }

  var matches = {};
  companies.forEach( company => {
   normalize(company).split(' ').forEach( word => {
     var match = uniqueTokens[word];
     if (match) {
       matches[company] = match;
     }
   });
  });

  console.log(matches);
  console.log(Object.keys(matches).length);
}
