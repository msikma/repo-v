#!/usr/bin/env node

var repoV = require('../repo-v');

// Example usage.
var version = repoV.getVersion();
console.log(version);
console.log('getRaw(\'last-commit\'): ' + repoV.getRaw('last-commit'));