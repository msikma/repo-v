// repo-v <https://github.com/msikma/repo-v>
// Copyright (C) 2015, Michiel Sikma <michiel@sikma.org>
// MIT licensed

var parser = require('./parser');
var defaultArgs = require('./defaults');
var defaultTemplate = '%branch-any%-%count%-%hash%';

var repoV = {
  /**
   * Returns a string with Git repository version information, parsed
   * from a passed template string (or the default).
   *
   * @param {String} tpl The template to use for the version string generation.
   * @returns {String} A string of version information
   */
  'getVersion': function(tpl) {
    tpl = typeof tpl !== 'undefined' ? tpl : defaultTemplate;
    var segments = parser.parseSegmentsFromTemplate(tpl);
    return parser.decorateTemplate(tpl, segments);
  },

  // Reference to the parser module.
  'parser': parser
};

// Stick in our default arguments.
repoV.parser.mergeGitArgs(defaultArgs);

module.exports = repoV;
