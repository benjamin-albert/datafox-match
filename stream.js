var JSONStream = require('JSONStream');

var createReadStream = require('fs').createReadStream;
var mapSync = require('event-stream').mapSync;
var csv = require('fast-csv');

var stream = createReadStream('crm.csv');

var companies = [];

var csvStream = csv()
    .on('data', function(data) {
      companies.push(data[0]);
    })
    .on('end', function() {

      createReadStream('./db.json')
        .pipe(JSONStream.parse('*'))
        .on('data', function(data) {
          var keywords = [];

          data.name.split(' ').forEach( key => keywords.push(key) );
          data.corporate_names.forEach( name => name.split(' ').forEach(key => keywords.push(key)) );
          data.fka_names.forEach( name => name.split(' ').forEach(key => keywords.push(key)) );

          companies.forEach( comp => comp.split(' ').forEach( word =>  {
            if (~keywords.indexOf(word)) {
              // console.log()
            }
          }) );


        });


    });

stream.pipe(csvStream);
/*
createReadStream('./db.json')
  .pipe(JSONStream.parse('*'))
  .on('data', function(data) {
    console.log(data);
    console.log('------');
  });
*/
