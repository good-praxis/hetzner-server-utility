import { generateKeyPair } from 'crypto';

export function generateRSAKeyPair(
  callback: (keys: { priv: string; pub: string }) => void
) {
  const res: { priv: string; pub: string } = {
    priv: undefined,
    pub: undefined
  };
  generateKeyPair(
    'rsa',
    {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: process.env.PASSPHRASE
      }
    },
    (err, publicKey, privateKey) => {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log(`generate new keypair`);
      callback({ priv: privateKey, pub: publicKey });
    }
  );

  return res;
}
