const fs = require('fs');
const parse = require('./lib/parse');

var csvFile = fs.createReadStream('crm.csv');
parse(csvFile).then(tokenizeCompanies);

function normalize(name) {
  return name.toLowerCase().replace(/[^a-z0-9 ]/gi, '');
}

function tokenizeCompanies(companies) {
  var tokenMap = {};

  var db = require('./db.json');

  db.forEach(function(rec) {
    var matches = {};

    function addToken(token) {
      if (!matches[token]) {
        matches[token] = 1;
        var obj = tokenMap[token] || (tokenMap[token] = {});

        obj.ambiguity = (obj.ambiguity + 1) || 0;
        obj.records = obj.records || [];
        obj.records.push(rec.id);
      }
    }

    function tokenize(company) {
      normalize(company).split(' ').forEach( addToken );
    }

    tokenize(rec.name);
    rec.corporate_names.forEach(tokenize);
    rec.fka_names.forEach(tokenize);
  } );

  var uniqueTokens = {};
  for (var token in tokenMap) {
    var obj = tokenMap[token];
    if (obj.ambiguity < 8) {
      uniqueTokens[token] = obj.records;
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
