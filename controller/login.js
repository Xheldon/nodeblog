var express = require('express');
var router = express.Router();
var $data = require('../model/core').$user;
var $ = require('../controller/util');
var wrap = require('co-express');

router.get('/', wrap(function *(req, res, next) {
    console.log(req.headers);
    if(!(req.session.user.username == null || req.session.user == null)){
        if(req.headers.referer === undefined){
            // 若已经登录,而直接访问登录地址,则跳转到首页
            res.redirect('/')
        }else{
            // 如果已经登录,仍然访问这个页面,则跳转到来时的地址
            res.redirect(req.headers.referer);
        }
    }else{
        res.render('login');
    }
}));

router.post('/', wrap(function *(req, res, next) {
    var user = req.body['username'],
        pw = req.body['password'],
        _user = yield $data.getUserByUserName(user);//未找到为null
    if(_user != null && _user['password'] == pw){
        //登录成功
        req.session.user = {
            username: _user.username,
            email: _user.email,
            login: true
        };
        res.send('1');
    }else{
        res.send('0');
    }
}));

module.exports = router;