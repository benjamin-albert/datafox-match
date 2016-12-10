var createReadStream = require('fs').createReadStream;
var csv = require('fast-csv');

var stream = createReadStream('crm.csv');

var words = {};
var matches = {};
var companies = [];

var csvStream = csv()
    .on('data', function(data) {
      companies.push(data[0]);
    })
    .on('end', function() {
      var db = require('./db.json');

      db.forEach(function(rec) {
        var recWords = {};

        rec.name.split(' ').forEach( word => {
          if (recWords[word.toLowerCase()])return;
          recWords[word.toLowerCase()] = 1;

          rec.count = (rec.count + 1) || 0;
          words[word.toLowerCase()] = rec;
        } );

        rec.corporate_names.forEach(name => {
          name.split(' ').forEach( word => {
            if (recWords[word.toLowerCase()])return;
            recWords[word.toLowerCase()] = 1;

            rec.count = (rec.count + 1) || 0;
            words[word.toLowerCase()] = rec;
          } );
        });

     } );

console.log(words['corporation'].count);return;

     var uniqueWords = {};
     for (var word in words) {
      //  console.log(words[word].count);
       if (words[word].count < 3) {
         uniqueWords[word] = words[word];
       }
     }

    //  console.log(uniqueWords);return;

     companies.forEach( comp => {
       comp.split(' ').forEach( word => {
         var match = uniqueWords[word.toLowerCase()];
         if (match) {
           matches[comp] = match.id;
         }
       });
     });

     console.log(matches);
    });

stream.pipe(csvStream);
