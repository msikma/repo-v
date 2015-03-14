repo-v
======

This is a simple script that retrieves basic version information from
the Git repository state using a synchronous call. This can be used to
print version numbers for staging (non-live) purposes.

Keep in mind that synchronous calls will block the thread, meaning this
should only be used in build systems and the likes.


Usage
-----

Import the module and run `getVersion()` to get started:

```javascript
var repoV = require('../repo-v');
var version = repoV.getVersion();
console.log(version); // e.g. master-r15-cf3ffb9
```

In this example, we're on the master branch, the 15th commit, identified
by the short hash `cf3ffb9`.

You can send a template to `getVersion()` to get customized output. It
supports a number of variables:

* branch – branch name (even when in detached mode)
* count – commit number
* hash – short hash (6 characters)
* hash-full – long hash

To use them, pass a string as argument containing the variables you want
in between % signs. The default template is `%branch%-%rev%-%count%`.
Any variable that is for some reason unavailable will be replaced with
*(unknown)*.

### Advanced

To change the Git command:

```javascript
repoV.parser.gitCmd = '../../some/path/git';
```

To change the fallback string used for variables that couldn't be
computed:

```javascript
repoV.parser.unknownSegment = '(N/A)'; // default: '(unknown)'
```

You can also add your own Git commands to run using
`repoV.parser.mergeGitArgs()`. See the included `defaults.js` file for an
example of how to do this.


License
-------

MIT licensed.
