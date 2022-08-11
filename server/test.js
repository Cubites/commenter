async function tokenCompare(plainPassword, tokens) {
    await tokens.forEach(id_token => {
        console.log('forEach');
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

