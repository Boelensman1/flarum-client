/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const q = require('q');

// from https://gist.github.com/liangzan/807712#gistcomment-337828
/* eslint-disable */
const rmDir = function(dirPath) {
  try { var files = fs.readdirSync(dirPath); }
  catch(e) { return; }
  if (files.length > 0)
    for (var i = 0; i < files.length; i++) {
      var filePath = dirPath + '/' + files[i];
      if (fs.statSync(filePath).isFile())
        fs.unlinkSync(filePath);
      else
        rmDir(filePath);
    }
  fs.rmdirSync(dirPath);
};
/* eslint-enable */

const dir = path.join(__dirname, '/docs');

const runCommand = (command, cwd) => (
  new q.Promise((resolve, reject) => {
    let options = null;
    if (cwd) {
      options = { cwd };
    }
    exec(command, options, (err, stdout) => {
      if (err) { console.error(err); return reject(); }
      return resolve();
    });
  })
);

const gitCheckout = () => {
  console.log('Checking out gh-pages branch');
  return runCommand('git checkout gh-pages', dir);
};

const generateDocs = () => {
  console.log('Generating docs');
  return runCommand('npm run generate-docs');
};

const gitAdd = () => {
  console.log('Adding files');
  return runCommand('git add .', dir);
};

const gitCommit = (message) => {
  console.log('Committing');
  return runCommand(`git commit -m "${message}"`, dir);
};

const gitPush = () => {
  console.log('Pushing');
  return runCommand('git push', dir);
};

const removeDirectory = () => {
  rmDir(dir);
  return q.Promise.resolve();
};


const deployDocs = (message) => {
  console.log('Creating directory');
  fs.mkdirSync(dir);
  console.log('Cloning repo');
  return runCommand(`git clone -l . '${dir}'`)
    .then(gitCheckout)
    .then(generateDocs)
    .then(gitAdd)
    .then(() => (gitCommit(message)))
    .then(gitPush)
    .then(removeDirectory);
};

if (process.argv.length < 3) {
  console.log('You need to give a commit message as argument.');
  process.exit(-1);
} else {
  const message = process.argv.splice(2).join(' ');
  console.log('Using ', `"${message}"`, 'as commit message.');
  deployDocs(message).then(process.exit);
}
