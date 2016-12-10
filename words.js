var createReadStream = require('fs').createReadStream;
var csv = require('fast-csv');

var stream = createReadStream('crm.csv');

var companies = [];
var keywords = {};
var matches = {};
var csvStream = csv()
    .on('data', function(data) {
      companies.push(data[0]);
    })
    .on('end', function() {
      var db = require('./db.json');

      db.forEach(function(rec) {
        companies.forEach( comp => {
          comp.split(' ').forEach( word => {
            var exp = new RegExp(word, 'i');
            if (exp.test(rec.name)) {
              matches[comp] = rec.id;
            } else {
              rec.corporate_names.forEach(name => {
                if (exp.test(name)) {
                  matches[comp] = rec.id;
                }
              });
            }
          });
        } );

      })

      console.log(matches);
    });

stream.pipe(csvStream);
