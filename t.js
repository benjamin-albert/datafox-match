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
          recMap[word] = rec;
        } );

        rec.corporate_names.forEach(name => {
          name.split(' ').forEach( word => {
            var word = normalize(word.toLowerCase());
            if (recWords[word])return;
            // console.log(word);
            recWords[word] = 1;

            words[word] = (words[word] + 1) || 0;
            recMap[word] = rec;
          } );
        });

        rec.fka_names.forEach(name => {
          name.split(' ').forEach( word => {
            var word = normalize(word.toLowerCase());
            if (recWords[word])return;
            // console.log(word);
            recWords[word] = 1;

            words[word] = (words[word] + 1) || 0;
            recMap[word] = rec;
          } );
        });

     } );

// console.log(words['netc']);return;

     var uniqueWords = {};
     for (var word in words) {
      //  console.log(words[word].count);
       if (words[word] < 3) {
         uniqueWords[word] = recMap[word];
       }
     }
// console.log(uniqueWords['netc']);return;
    //  console.log(uniqueWords);return;

     companies.forEach( comp => {
       comp.split(' ').forEach( word => {
         var match = uniqueWords[normalize(word.toLowerCase())];
         if (match) {
           matches[comp] = match.id;
         }
       });
     });

     console.log(matches);
    });

stream.pipe(csvStream);
