var createReadStream = require('fs').createReadStream;
var csv = require('fast-csv');

var stream = createReadStream('crm.csv');

var words = {};
var recMap = {};
var matches = {};
var companies = [];

function normalize(name) {
  return name.trim().replace(/[^a-z0-9 ]/gi, '');
}

var csvStream = csv()
    .on('data', function(data) {
      companies.push(data[0]);
    })
    .on('end', function() {
      var db = require('./db.json');

      db.forEach(function(rec) {
        var recWords = {};

        rec.name.split(' ').forEach( word => {
          var word = normalize(word.toLowerCase());

          if (recWords[word])return;
          recWords[word] = 1;

          words[word] = (words[word] + 1) || 0;
          recMap[word] = recMap[word] || [];
          recMap[word].push(rec.id);
        } );

        rec.corporate_names.forEach(name => {
          name.split(' ').forEach( word => {
            var word = normalize(word.toLowerCase());
            if (recWords[word])return;
            recWords[word] = 1;

            words[word] = (words[word] + 1) || 0;
            recMap[word] = recMap[word] || [];
            recMap[word].push(rec.id);
          } );
        });

        rec.fka_names.forEach(name => {
          name.split(' ').forEach( word => {
            var word = normalize(word.toLowerCase());
            if (recWords[word])return;
            recWords[word] = 1;

            words[word] = (words[word] + 1) || 0;
            recMap[word] = recMap[word] || [];
            recMap[word].push(rec.id);
          } );
        });

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
