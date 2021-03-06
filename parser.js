// repo-v <https://github.com/msikma/repo-v>
// Copyright (C) 2015, Michiel Sikma <michiel@sikma.org>
// MIT licensed

var execSync = require('child_process').execSync;

var parser = {
  // The active Git command.
  'gitCmd': 'git',

  // The argument recipes we can pass to Git to get version information.
  'gitArgs': {},

  // Helper regex for parsing segments.
  // Parses everything in between % characters, but permits escaping \%.
  'tplRe': /%([^%]*?(\\\%)?[^%]*?[^\\])%/g,

  // The substitute in case we can't parse or understand a segment.
  'unknownSegment': '(unknown)',

  /**
   * Extracts segments from a template string, runs Git commands to retrieve
   * their results where possible, and then returns them as an object.
   *
   * @param {String} tpl Template string to use for matching
   * @returns {Object} The template segments and their command results
   */
  'parseSegmentsFromTemplate': function(tpl) {
    var n, segment, segmentCmd, cmdSuccess, parsedSegments = {};
    var templateSegments = parser.parseTemplate(tpl);

    // Iterate over every segment in the template and run its
    // corresponding Git command.
    for (n = 0; n < templateSegments.length; ++n) {
      segment = templateSegments[n];
      segmentCmd = parser.gitArgs[segment];

      // Attempt to run the command. If it fails, set the segment to
      // the unknown segment string.
      try {
        parsedSegments[segment] = parser.parseSegment(segmentCmd).toString().trim();
        cmdSuccess = true;
      } catch(e) {
        parsedSegments[segment] = parser.unknownSegment;
        cmdSuccess = false;
      }

      // If we have a transformer function, call it on the output
      // before returning it, even if the command failed.
      if (segmentCmd[1]) {
        parsedSegments[segment] = segmentCmd[1].apply(this, [
          parsedSegments[segment],
          cmdSuccess]
        );
      }
    }
    return parsedSegments;
  },
  
  /**
   * Returns the raw value of a single item.
   *
   * @param {String} item The item to parse
   */
  'parseItem': function(item) {
    var itemCmd = parser.gitArgs[item];
    var cmdSuccess, result;
    try {
      result = parser.parseSegment(itemCmd).toString().trim();
      cmdSuccess = true;
    } catch(e) {
      result = parser.unknownSegment;
      cmdSuccess = false;
    }
    // If we have a transformer function, call it on the output
    // before returning it, even if the command failed.
    if (itemCmd[1]) {
      result = itemCmd[1].apply(this, [result, cmdSuccess]);
    }
    return result;
  },

  /**
   * Returns an array of replaceable segments extracted from the template.
   *
   * @param {String} tpl The template to match against
   * @returns {Array} The matched segments from the template
   */
  'parseTemplate': function(tpl) {
    var match, matches = [];
    while ((match = parser.tplRe.exec(tpl)) != null) {
      matches.push(match[1]);
    }
    return matches;
  },

  /**
   * Runs a synchronous console command for a segment and returns the result.
   * If a transformer function is defined, the output is first passed through
   * it before it's returned.
   *
   * @param {Array} segmentCmd An array with command (and transformer function.)
   * @returns {String} The result of the segment's corresponding command.
   */
  'parseSegment': function(segmentCmd) {
    // Run the command and retrieve the output.
    return execSync(parser.gitCmd + ' ' + segmentCmd[0]);
  },

  /**
   * Takes a template and an object of the parsed segments from that
   * template, and returns a neatly decorated version string.
   *
   * @param {String} tpl The template string
   * @param {Object} segments The matched segments from the template
   * @returns {String} A decorated string with version information
   */
  'decorateTemplate': function(tpl, segments) {
    var segment;
    for (segment in segments) {
      if (!segments.hasOwnProperty(segment)) {
        continue;
      }
      // Replace the %original% string from the template with
      // the {original: 'something'} that was retrieved from Git.
      tpl = tpl.replace('%' + segment + '%', segments[segment]);
    }
    return tpl;
  },

  /**
   * Sets the current list of active Git arguments.
   *
   * @param {Object} args An object of segment names and Git instructions
   * @returns {Boolean} Success or failure
   */
  'setGitArgs': function(args) {
    parser.gitArgs = args;
    return true;
  },

  /**
   * Merges together a set of Git arguments with the current ones.
   *
   * @param {Object} args An object of segment names and Git instructions
   * @returns {Boolean} Success or failure
   */
  'mergeGitArgs': function(args) {
    var arg, combinedArgs;
    combinedArgs = parser.gitArgs;
    for (arg in args) {
      if (!args.hasOwnProperty(arg)) {
        continue;
      }
      combinedArgs[arg] = args[arg];
    }
    return parser.setGitArgs(combinedArgs);
  }
};

module.exports = parser;
