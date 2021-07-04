console.log('I am a locker');
const _crypto = require('cryptojs');
const crypto = _crypto.Crypto;
const AWS = require('aws-sdk');

let _passphrase;

const init = (passphrase) => {
    _passphrase = passphrase;
};

const set = (key, value) =>  new Promise((resolve, reject) => {
    console.log("want to set key " + key + " with value " + value);
    const encrypted = crypto.AES.encrypt(value, _passphrase);
    console.log(encrypted);
    const b64encrypted = Buffer.from(encrypted).toString('base64');

    const docClient = new AWS.DynamoDB.DocumentClient({
        region: 'us-west-2'
    });

    const tableName = 'hg_locker';
    const params = {
        TableName: tableName,
        Item: {
            'user_id': 'joseph',
            'key': 'testkey',
            'value': b64encrypted
        }
    };

    docClient.put(params, (err, data) => {
        console.log(err);
        console.log(data);
        resolve();
    });
});

const get = (key) => new Promise((resolve, reject) => {
    console.log("want to get key " + key);
    const docClient = new AWS.DynamoDB.DocumentClient({
        region: 'us-west-2'
    });

    const tableName = 'hg_locker';
    const params = {
        TableName: tableName,
        Key: {
            'user_id': 'joseph',
            'key': 'testkey'
        }
    };

    docClient.get(params, (err, data) => {
        console.log(err);
        console.log(data);
        const b64 = data.Item.value;
        const ascii = Buffer.from(b64, 'base64').toString('ascii');
        console.log(ascii);
        const decrypted = crypto.AES.decrypt(ascii, _passphrase);
        resolve(decrypted);
    });
 
});

module.exports = {
    init,
    set,
    get
};
