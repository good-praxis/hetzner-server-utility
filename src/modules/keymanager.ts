import fs from 'fs';
import { generateRSAKeyPair } from './rsa';
import { createFolderIfNotExists } from '../utils/fs';
import { updateKey } from './hcloud/sshkeys';

export const keys: { priv: string; pub: string } = {
  priv: undefined,
  pub: undefined
};

export function onKeysReady(cb: Function, args?: any) {
  if (keys.priv && keys.pub) {
    cb(args);
  } else {
    setTimeout(onKeysReady, 1000, cb, args);
  }
}

function checkIfKeypairExists(path = 'keys') {
  try {
    if (fs.existsSync(`${path}/priv.pem`) && fs.existsSync(`${path}/pub.pem`)) {
      return true;
    }
  } catch (e) {
    console.log(e, 'Error checking if keypair exists');
  }
}

function generateKeypair() {
  generateRSAKeyPair(receiveKeypair);
}

function receiveKeypair(keys: { priv: string; pub: string }, path = 'keys') {
  try {
    createFolderIfNotExists(path);
    if (!fs.existsSync(`${path}/priv.pem`)) {
      fs.writeFileSync(`${path}/priv.pem`, keys.priv);
    }
    if (!fs.existsSync(`${path}/pub.pem`)) {
      fs.writeFileSync(`${path}/pub.pem`, keys.pub);
    }
  } catch (e) {
    console.log(e, 'Error generating keypair');
  }
}

function readKeypair(path = 'keys') {
  if (!checkIfKeypairExists(path)) {
    scheduleReadKeypair();
    return;
  }
  keys.priv = fs.readFileSync(`${path}/priv.pem`).toString();
  keys.pub = fs.readFileSync(`${path}/pub.pem`).toString();
  console.log(`Using keypair with pub key \n ${keys.pub}`);
}

function scheduleReadKeypair() {
  setTimeout(() => {
    readKeypair();
  }, 1000);
}

// Checks if keypair exists, generates if it doesn't
export function initalizeKeys() {
  if (!checkIfKeypairExists()) {
    generateKeypair();
  }
  scheduleReadKeypair();
}
