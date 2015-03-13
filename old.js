


/**
 * Retrieves info from git and stores the data in gitData.
 * @param {String} key
 * @param {Array} args
 */
function runGitCommand(key, args) {
  // Run the git command and store the value in gitData.
  grunt.util.spawn({
    cmd: gitCmd,
    args: args
  }, function(error, result) {
    if (error) {
      console.log('error in retrieving git data', error);
      errorStatus = true;
    }
    gitData[key] = result.stdout;
    checkVersionDataStatus();
  });
}

/**
 * Checks whether we have enough data to return.
 */
function checkVersionDataStatus() {
  //
  console.log(gitData);
}

/**
 * Retrieves git data synchronously and returns it.
 * This will block the thread until resolution, so use it sparingly.
 * @returns {{}} The git version information
 */
function getGitVersionInfoSync() {

  return gitData;
}

/**
 * Retrieves git data asynchronously.
 */
var getGitVersionInfoAsync = function() {
  var arg;

  // Iterate through the arguments we're interested in and
  // call the helper function to get the info.
  for (arg in gitArgs) {
    if (!gitArgs.hasOwnProperty(arg)) {
      continue;
    }
    runGitCommand(arg, gitArgs[arg]);
  }
};

module.exports = {
  'getGitVersionInfoAsync': getGitVersionInfoAsync,
  'getGitVersionInfoSync': getGitVersionInfoSync,
  'checkVersionDataStatus': checkVersionDataStatus,
  'gitData': gitData,
  'errorStatus': errorStatus
};
