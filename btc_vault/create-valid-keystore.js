const keythereum = require("keythereum");
const fs = require("fs");

const privateKeyHex = process.argv[2];
if (!privateKeyHex) {
    console.error("❌ Please provide your private key as the first argument.");
    process.exit(1);
}

const password = process.argv[3];
if (!password) {
    console.error("❌ Please provide your password as the second argument.");
    process.exit(1);
}

const dk = keythereum.create();
dk.privateKey = Buffer.from(privateKeyHex.replace(/^0x/, ""), "hex");

const options = {
    kdf: "scrypt",
    cipher: "aes-128-ctr",
};

const keystore = keythereum.dump(password, dk.privateKey, dk.salt, dk.iv, options);
fs.writeFileSync("keystore.json", JSON.stringify(keystore, null, 2));
console.log("✅ Keystore written to keystore.json");
