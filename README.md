# DataFox match assignment

Matches dirty CRM records to possible "database" records.

## Run

This implementation uses ES6 and requires [Node.js 4+](https://nodejs.org/en/) to run.


Clone the repository (or download a zip file).

```sh
$ cd datafox-match
$ npm install
$ node .
```

## Output
```
{ Meraki: [ '5130efc88989846a36000b42' ],
  'Climate Corporation': [ '54eed65f04ee1c2761001ec3', '515103cc2857b57a510c8745' ],
  Intercom: [ '5654e9f85cfc3b3461078207', '5130f0688989846a3602182e' ],
  McKinsey: [ '5130efcd8989846a36001c04' ],
  'Lending Club': [ '5130efc48989846a3600041e' ],
  Periscope:
   [ '53af5b44bf9923352a06924b',
     '557b3ffc560c0d3c1400115b',
     '5130f0238989846a3601300e',
     '55c24e0d6dab3f8a5d0002c9' ],
  'Netc, LLC': [ '56661e0b2587201b5402b0d8' ],
  Zenpayroll: [ '5130f0bb8989846a360348d0' ],
  Walmart: [ '5130efff8989846a3600b366' ],
  Uber: [ '5130f02c8989846a36014832' ],
  'Netezza Corporation': [ '5130efec8989846a36007644' ],
  Slack: [ '535b48185bf2732308000209' ],
  Datafox: [ '51c6b9a5a9812aa90b123980', '56bd004737f55c275a55a980' ],
  WePay: [ '5130f0118989846a3600efee' ] }
----------------
14 out of 16 companies found
Execution time: 130ms
```
