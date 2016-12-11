var createReadStream = require('fs').createReadStream;
var csv = require('fast-csv');

module.exports = function parse(readableStream) {
  return new Promise( (resolve, reject) => {
    var companies = [];

    var csvStream = csv()
      .on('data', function(data) {
        companies.push(data[0]);
      })
      .on('error', reject)
      .on('end', function() {
        resolve(companies);
      });

      readableStream.pipe(csvStream);
  });
};
