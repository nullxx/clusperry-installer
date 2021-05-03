const { spawn } = require('child_process');
const drivelist = require('drivelist');
const _ = require('lodash');
const os = require('os');
const fs = require('fs');

const mountImage = (imagePath) => {
  return new Promise(async (res, rej) => {
    const drivesBefore = await drivelist.list();
    let args;
    switch (os.platform()) {
      case 'darwin':
        args = ['hdiutil', ['mount', imagePath]];
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

    ls.on('close', (code) => {
      console.log('mountImage', 'close', 'code', code);

      setTimeout(async () => {
        const newDrives = await drivelist.list();
        console.log(drivesBefore.length, newDrives.length);
        res({
          code,
          drive: newDrives.find((d) => !_.some(drivesBefore, d)),
        });
      }, 1000);
    });

    ls.on('error', rej);
  });
};

const unmountImage = (imagePath) => {
  return new Promise(async (res, rej) => {
    let drivesBefore = await drivelist.list();
    let args;
    switch (os.platform()) {
      case 'darwin':
        args = ['hdiutil', ['unmount', imagePath]];
        break;
      case 'linux':
        const imageName = imagePath.split('/').pop();
        const mountPath = `/mnt/${imageName}`;
        fs.mkdirSync(mountPath);
        args = ['unmount', ['-o', 'loop', imagePath, mountPath]];
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

    ls.on('close', (code) => {
      console.log('unmountImage', 'close', 'code', code);

      setTimeout(async () => {
        const newDrives = await drivelist.list();
        console.log(drivesBefore.length, newDrives.length);
        res({
          code,
          drive: newDrives.find((d) => !_.some(drivesBefore, d)),
        });
      }, 1000);
    });

    ls.on('error', rej);
  });
};

const ejectImage = (imagePath) => {
  return new Promise(async (res, rej) => {
    let drivesBefore = await drivelist.list();
    let args;
    switch (os.platform()) {
      case 'darwin':
        args = ['hdiutil', ['eject', imagePath]];
        break;
      case 'linux':
        const imageName = imagePath.split('/').pop();
        const mountPath = `/mnt/${imageName}`;
        fs.mkdirSync(mountPath);
        args = ['eject', ['-o', 'loop', imagePath, mountPath]];
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

    ls.on('close', (code) => {
      console.log('eject', 'close', 'code', code);

      setTimeout(async () => {
        const newDrives = await drivelist.list();
        console.log(drivesBefore.length, newDrives.length);
        res({
          code,
          drive: newDrives.find((d) => !_.some(drivesBefore, d)),
        });
      }, 1000);
    });

    ls.on('error', rej);
  });
};

module.exports.mountImage = mountImage;
module.exports.unmountImage = unmountImage;
module.exports.ejectImage = ejectImage;
