var createReadStream = require('fs').createReadStream;
var csv = require('fast-csv');

var stream = createReadStream('crm.csv');

var words = {};
var recMap = {};
var matches = {};
var companies = [];

function normalize(name) {
  return name.toLowerCase().replace(/[^a-z0-9 ]/gi, '');
}

var csvStream = csv()
    .on('data', function(data) {
      companies.push(data[0]);
    })
    .on('end', function() {
      var db = require('./db.json');

      db.forEach(function(rec) {
        var recWords = {};

        function addToken(token) {
          if (!recWords[token]) {
            recWords[token] = 1;

            words[token] = (words[token] + 1) || 0;
            recMap[token] = recMap[token] || [];
            recMap[token].push(rec.id);
          }
        }

        function tokenize(company) {
          normalize(company).split(' ').forEach( addToken );
        }

        tokenize(rec.name);
        rec.corporate_names.forEach(tokenize);
        rec.fka_names.forEach(tokenize);

     } );

     var uniqueWords = {};
     for (var word in words) {
       if (words[word] < 8) {
         uniqueWords[word] = recMap[word];
       }
     }

     companies.forEach( comp => {
       comp.split(' ').forEach( word => {
         var match = uniqueWords[normalize(word.toLowerCase())];
         if (match) {
           matches[comp] = match;
         }
       });
     });

     console.log(matches);
     console.log(Object.keys(matches).length);
    });

stream.pipe(csvStream);
