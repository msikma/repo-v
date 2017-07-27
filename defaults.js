// repo-v <https://github.com/msikma/repo-v>
// Copyright (C) 2015, Michiel Sikma <michiel@sikma.org>
// MIT licensed

/**
 * Parser function that modifies the output of the 'count-hex' command.
 * This transforms the number into a hexadecimal one. In actuality,
 * this is an example of how to use transformer functions for Git output.
 *
 * @param {String} str The string returned from the Git command
 * @param {Boolean} success Whether the command was successful or not
 * @returns {String} The modified and cleaned up string
 */
var countHex = function(str, success) {
  if (!success) {
    return str;
  }
  var n = parseInt(str, 10);
  return n.toString(16);
};

/**
 * Takes a date returned to us from Git and turns it into a Python date object.
 * The date is given in Unix time, e.g. '1486023001'.
 *
 * @param {String} str The string returned from the Git command
 * @param {Boolean} success Whether the command was successful or not
 * @returns {String} The time as JS timestamp
 */
var makedate = function(ts, success) {
  if (!success) {
    return str;
  }
  return new Date(ts * 1000);
};

/**
 * Parser function that modifies the output of the 'branch-any' command.
 * This removes the 'heads/' part from the output for a regular branch.
 *
 * @param {String} str The string returned from the Git command
 * @param {Boolean} success Whether the command was successful or not
 * @returns {String} The modified and cleaned up string
 */
var anyBranch = function(str, success) {
  if (!success) {
    return str;
  }
  // Filter out heads/ in case of a regular branch name.
  if (str.indexOf('heads/') === 0) {
    str = str.replace('heads/', '');
  }
  return str;
};

// Return all standard command formulas.
module.exports = {
  // Branch name (even while in detached mode).
  'branch': ['for-each-ref --format=\'%(refname:short)\' refs/heads'],
  // Branch name (but returns different answers per mode; see readme).
  'branch-any': ['describe --all', anyBranch],
  // All branch names
  'branch-all': ['log -n 1 --pretty=%D HEAD'],
  // Short commit hash.
  'hash': ['rev-parse --short HEAD'],
  // Full commit hash.
  'hash-full': ['rev-parse HEAD'],
  // Revision number (number of commits since initial).
  'count': ['rev-list HEAD --count'],
  // Revision number in hexadecimal (example of how to use a transformer).
  'count-hex': ['rev-list HEAD --count', countHex],
  // Last commit date.
  'last-commit': ['log -n 1 --date=format:%s --pretty=format:%cd', makedate]
};
