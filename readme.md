repo-v
======

This is a simple script that retrieves basic version information from
the Git repository state using a synchronous call. This can be used to
print version numbers for staging (non-live) purposes.

Keep in mind that synchronous calls will block the thread, meaning this
should only be used in build systems and the likes.


Installing
----------

This package is [available on npm](https://www.npmjs.com/package/repo-v):

    npm install --save-dev repo-v

The `--save-dev` is used to save the package to your own `packages.json` file.

The source is [available on Github](https://github.com/msikma/repo-v).


Usage
-----

Import the module and run `getVersion()` to get started:

```javascript
var repoV = require('../repo-v');
var version = repoV.getVersion();
console.log(version); // e.g. master-27-7072898
```

In this example, we're on the master branch, the 27th commit, identified
by the short hash `7072898`.

You can pass a template to `getVersion()` to get customized output. Use a
string as argument containing the variables you want in between % signs.
The default template is `%branch-any%-%count%-%hash%`. Any variable that
is for some reason unavailable will be replaced with `(unknown)`:

```javascript
repoV.getVersion('%branch%');      // master
repoV.getVersion('%branch-any%');  // (depends on situation, see below)
repoV.getVersion('%branch-all%');  // HEAD, origin/master, master
repoV.getVersion('%count%');       // 27
repoV.getVersion('%count-hex%');   // 1b
repoV.getVersion('%hash%');        // 7072898
repoV.getVersion('%hash-full%');   // 7072898a6a04f867c7d7b8a8aa4249a8d408bc0a
repoV.getVersion('%foobar%');      // (unknown)
```

The `%branch-any%` variable is the most versatile. The following is returned
depending on the situation:

* local branch: master
* remote tracking branch (in sync): master
* remote tracking branch (not in sync): remotes/origin/feature-foo
* tag: v1.2.3
* general detached head: v1.0.6-5-g2393761

If the `git` command itself is unusable for some reason, all variables
will become `(unknown)`.

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
