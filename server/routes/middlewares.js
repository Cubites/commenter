// login check
exports.isLoggedIn = (req, res, next) => {
    if(req.cookie.auth){
        
    }
    next();
};

exports.isJoined = (req, res, next) => {
    if(login_method === 'N'){
        Mariadb.query(`select naver_token from user where naver_token = ${req.body.user_code};`, (err, data) => {
            if(err) return res.send(err);
            
        })

    }else if(login_method === 'K'){

    }
    next();
};

exports = () => {

}