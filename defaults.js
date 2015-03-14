// repo-v <https://github.com/msikma/repo-v>
// Copyright (C) 2015, Michiel Sikma <michiel@sikma.org>
// MIT licensed

/**
 * Parser function that modifies the output of the 'branch' command.
 * The Git command outputs something like the following:
 *
 *    (HEAD, origin/develop, develop, bugfix-something)
 *
 * The branch name we're after is 'bugfix-something'. This function
 * extracts it from the list.
 *
 * @param {String} str The string returned from the Git command
 * @returns {String} The modified and cleaned up string
 */
var parseBranch = function(str) {
  var branches = /\((.+?)\)/.exec(str);
  branches = branches[1].split(',');
  return branches[branches.length - 1].trim();
};

// Return all standard command formulas.
module.exports = {
  // Branch name (even while in detached mode).
  'branch': ['log -n 1 --pretty=%d HEAD', parseBranch],
  // Short commit hash.
  'hash': ['rev-parse --short HEAD'],
  // Full commit hash.
  'hash-full': ['rev-parse HEAD'],
  // Revision number (number of commits since initial).
  'count': ['rev-list HEAD --count']
};
