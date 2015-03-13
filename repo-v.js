#!/usr/bin/env node
// repo-v <https://github.com/msikma/repo-v>
// Copyright (C) 2015, Michiel Sikma <michiel@sikma.org>
// MIT licensed

var execSync = require("exec-sync");

var gitCmd = 'git', gitData = {}, gitArgs = {
  // Branch name; 'master'
  //'branch': ['rev-parse --abbrev-ref HEAD'],
  // get branch while in detached: 
  'branch': ['git log -n 1 --pretty=%d HEAD', parseBranch],
  // ?
  'rev': ['rev-parse --short HEAD'],
  // Revision number (number of commits since initial)
  'count': ['rev-list HEAD --count']
};
var tplDefault = '%branch%-%rev%-%count%';
var tplRe = new RegExp('%[^%]*%', 'g');

var parse = function(tpl) {
  var execResult;
  try {
    execResult = execSync(gitArgs['branch']);
  } catch(e) {
    execResult = '(unknown)';
  }
  

  //var matches = tpl.match(tplRe);
  //console.log(matches);
};
parse(tplDefault);

var parseBranch = function(str) {
  return str;
};
