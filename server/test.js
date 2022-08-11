const bcrypt = require('bcrypt');

const saltRound = 10;

let plainPassword = 'asdf';

function hasing(plainPassword){
    bcrypt.genSalt(saltRound, function (err, salt){
        if(err) throw err;
        bcrypt.hash(plainPassword, salt, function (err, hash){
            if(err) throw err;
            return hash;
        });
    });
}

async function tokenCompare(plainPassword, tokens) {
    await tokens.forEach(id_token => {
        bcrypt.compare(plainPassword, id_token.token, (err, isMatch) => {
            console.log('1-1. isMatch : ' + isMatch);
            if(err) {
                console.log('err');
                res.status(500).send('bcrypt err : ' + err);
            }
            if(isMatch){
                return id_token.id;
            }
        });
    });
}

