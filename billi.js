#!/usr/bin/env node
'use strict';

const fs = require('fs');
const usage = `Usage: billi [filename]`;
const availablePlugins = [];
const ext = filename => filename.split('.').splice(-1)[0];

const billi = (filename, cb) => {

  if (typeof cb === 'undefined') { cb = console.log; }

  fs.readFile(filename, 'utf8', (err, text) => {
    if (err) throw err;

    let output = '';
    //let plugin = require(`${__dirname}/core-plugins`);
    let plugin;
    try {
      plugin = require(`${__dirname}/core-plugins/${ext(filename)}`);
    }
    catch(e) {
      plugin = text => (
        new Promise((resolve, request) => {
          resolve(text)
        })
      );
    }
    //console.log(plugin);
    //if (availablePlugins.indexOf(ext(filename)) > -1) { plugin = require(`${__dirname}/core-plugins/${ext(filename)}`); }
    plugin(text)
    .then(require(`${__dirname}/core-plugins`))
    .then(cb)
    .catch(e => console.log('Error: ', e));
  });

};

if (process.argv.length < 3) { console.log(usage); } else { billi(process.argv[2]); }
