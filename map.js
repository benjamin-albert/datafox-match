var db = require('./db.json');

var searchTerms = ['Netc, LLC'];

var companyMap = {};

function normalize(name) {
  return name.trim().replace(/[^a-z0-9 ]/gi, '');
}

db.forEach( rec => {
  rec.fka_names.forEach(name => {
    companyMap[normalize(name)] = rec.id;
  });

  rec.corporate_names.forEach(name => {
    companyMap[normalize(name)] = rec.id;
  });

  companyMap[normalize(rec.name)] = rec.id;
});

console.log(companyMap[normalize(searchTerms[0])]);
