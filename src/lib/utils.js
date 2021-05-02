const { spawn } = require('child_process');
const drivelist = require('drivelist');

const os = require('os');
const fs = require('fs');

const mountImage = async (imagePath) => {
  return new Promise(async (res, rej) => {
    let args;
    switch (os.platform()) {
      case 'darwin':
        args = ['open', [imagePath]];
        break;
      case 'linux':
        const imageName = imagePath.split('/').pop();
        const mountPath = `/mnt/${imageName}`;
        fs.mkdirSync(mountPath);
        args = ['mount', ['-o', 'loop', imagePath, mountPath]];
        break;
      default:
        break;
    }

    const ls = spawn(...args);

    ls.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    ls.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    ls.on('close', async (code) => {
      res({ code, drives: await drivelist.list() });
    });

    ls.on('error', rej);
  });
};

module.exports = { mountImage };
