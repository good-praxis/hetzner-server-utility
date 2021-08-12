import fs from 'fs';
import { generateRSAKeyPair } from './rsa';
import { createFolderIfNotExists } from '../utils/fs';

interface Keypair {
  priv: string;
  pub: string;
}

export const keypair: Keypair = {
  priv: undefined,
  pub: undefined
};

export function onKeypairReady(cb: Function, args?: any) {
  if (keypair.priv && keypair.pub) {
    cb(args);
  } else {
    setTimeout(onKeypairReady, 1000, cb, args);
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

function receiveKeypair({ priv, pub }: Keypair, path = 'keys') {
  try {
    createFolderIfNotExists(path);
    if (!fs.existsSync(`${path}/priv.pem`)) {
      fs.writeFileSync(`${path}/priv.pem`, priv);
    }
    if (!fs.existsSync(`${path}/pub.pem`)) {
      fs.writeFileSync(`${path}/pub.pem`, pub);
    }
  } catch (e) {
    console.log(e, 'Error generating keypair');
  }
}

function readKeypair(path = 'keys') {
  keypair.priv = fs.readFileSync(`${path}/priv.pem`).toString();
  keypair.pub = fs.readFileSync(`${path}/pub.pem`).toString();
  console.log(`Using keypair with pub key \n ${keypair.pub}`);
}

// Checks if keypair exists, generates if it doesn't
export function initalizeKeypair() {
  if (!checkIfKeypairExists()) {
    generateKeypair();
  } else {
    readKeypair();
  }
}
