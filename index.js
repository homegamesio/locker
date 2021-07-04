console.log('I am a JS process and I need a locker');
const locker = require('./locker');

// get this from CLI or something
locker.init('testpassphrase');

locker.set('Yooooo', 'lmao').then(() => {
    locker.get('Yooooo').then(_val => {
        console.log("GOT VALUE BACK");
        console.log(_val);
    });
});
