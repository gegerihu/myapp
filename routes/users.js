var express = require('express');
var router = express.Router();
var Content = require("../models/Content");
var User = require("../models/User");
var Application = require("../models/Application");
var Carousel = require("../models/Carousel");
var mongoose = require('mongoose');
var moment = require('moment');
var async = require('async');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var validator = require('validator');
var _ = require('underscore');

router.caseSensitive = true;

function isEmptyObject(obj) {
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
}


// 用户相关--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


//signup
router.post('/signup', function(req, res) {
    var user = req.body.user;
    var password = user.password;
    var confirmPwd = user.confirmPwd;
    var userName = user.userName;
    var email = user.email;
    var phone = user.phoneNum;
    var errors = new Object();
    console.log(user)

    if (!validator.isAlphanumeric(userName) || !validator.isLength(userName, { min: 5, max: 12 })) {
        errors.userName = "用户名5-12个英文数字组合!";
    }
    if (!validator.isAlphanumeric(password) || !validator.isLength(password, { min: 6, max: 12 })) {
        errors.password = "密码6-12位，只能包含字母、数字组合!";
    }
    if (password !== confirmPwd) {
        errors.notConfirm = "密码不匹配，请重新输入!";
    }
    if (!validator.isEmail(email)) {
        errors.email = "请填写正确的邮箱地址!";
    }
    if (!validator.isNumeric(phone) || phone.length !== 11) {
        errors.phone = "请填写正确的手机号码!";
    }
    if (!isEmptyObject(errors)) {
        // console.log(errors);
        return res.json(errors);
    } else {
        User.find({ 'userName': userName }, function(err, docs) {
            if (err) {
                throw err;
            }
            console.log(docs)
            if (docs.length > 0) {
                errors.userName = '用户名已注册,请重新填写!';
                return res.json(errors);
            } else {
                User.find({ 'email': email }, function(err, docs) {
                    if (err) {
                        throw err;
                    }
                    console.log(docs)
                    if (docs.length > 0) {
                        errors.email = '邮箱已注册,请重新填写!';
                        return res.json(errors);
                    } else {
                        console.log('save')
                        var user = new User(req.body.user);
                        user.save(function(err) {
                            // console.log(err);
                            if (err) {
                                throw err;
                            } else {
                                res.json({ success: '注册成功!' });
                            }
                        });
                    }
                });
            }
        });
    }
});

//login

router.post('/login', function(req, res) {
    var name = req.body.user.userName;
    var password = req.body.user.password;
    // remember=req.body.user.remember;
    // console.log(req.body.user);
    User.findOne({ userName: name }, function(err, user) {
        if (!user) {
            res.json({ danger: '用户不存在，请注册!' });
        } else {
            user.comparePassword(password, function(err, isMatch) {
                // 密码匹配
                if (isMatch) {
                    // if (remember) {
                    req.session.user = user;
                    //req.session.adminlogined = true;
                    return res.json({ success: '登录成功!' });
                    // 登录成功
                } else {
                    // 账户名和密码不匹
                    return res.json({ danger: '密码错误!' });
                }
            });
        }
    });
});

//logout
router.get('/logout', function(req, res) {
    delete req.session.user;
    res.redirect('/');
});

//application post
router.post('/application', function(req, res) {
    // console.log(req.body.application);
    if (req.body.application.outTime == '' || req.body.application.returnTime == '') {
        res.json({ danger: '请选择借用期限!' });
    } else {
        var form = new Application(req.body.application);
        form.save(function(err) {
            if (err) {
                res.end(err);
            } else {
                res.json({ success: '申请成功!' });
            }
        })
    };
})
//user application list
router.get('/user/applist', function(req, res) {
    var id = req.session.user._id;
    // console.log(id);
    // res.render('layouts/applist',{title:'申请列表'})

    Application.find({ user: id }, function(err, forms) {
        // console.log(forms);
        res.render('layouts/applist', {
            title: '申请列表',
            forms: forms
        })
    });
})
router.get('/user/appdetail/:id', function(req, res) {
    var _id = req.params.id;
    userId = req.session.user._id;
    console.log(_id);

    Application.findOne({ _id: _id }, function(err, form) {
        User.findById(userId, function(err, user) {
            // console.log(form);
            res.render('layouts/appdetail', {
                title: '申请表详情',
                form: form,
                user: user
            })
        })
    })
});

// reset password by email
router.get('/user/forgot', function(req, res) {
    res.render('layouts/user-forgot', {
        title: '忘记密码'
    })
});

router.post('/forgot', function(req, res, next) {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({ email: req.body.email }, function(err, user) {
                if (!user) {
                    return res.json({ danger: '不存在此邮件地址的账户，请填写正确的邮箱地址!' });
                } else {
                    if (user.resetPasswordExpires !== 'undefined' && user.resetPasswordExpires > Date.now()) {
                        return res.json({ danger: '修改密码链接地址已发送到 ' + user.email + ',请打开邮件继续操作，请勿重复请求!' });
                    }
                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
                    user.save(function(err) {
                        done(err, token, user);
                    });
                }
            });
        },
        function(token, user, done) {
            var transport = nodemailer.createTransport({
                host: 'smtp.qq.com',
                secureConnection: true, // use SSL
                port: 465, // port
                auth: {
                    user: '78436058@qq.com',
                    pass: 'juhhdikhwlpnbhjd'
                }
            });
            var mailOptions = {
                to: user.email,
                from: '"传媒系管理员"<gegerihu@qq.com>',
                subject: '传媒系重设密码链接',
                text: '您收到此邮件是因为有人忘记密码并由此邮箱地址发送请求修改密码\n\n' +
                    '请点击下面链接地址, 或者复制到浏览器地址栏中:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    '如不是您本人发出请求, 请忽略本邮件,您的密码不会发生改变。\n'
            };
            transport.sendMail(mailOptions, function(err, info) {
                if (err) {
                    return console.log(err);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
                res.json({ success: '修改密码链接地址已发送到 ' + user.email + ',请打开邮件继续操作。' });
                done(err, 'done');
            });
        }
    ], function(err) {
        if (err) return next(err);
        res.redirect('/user/forgot');
    });
});



router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        // console.log(user);
        if (!user) {
            res.render('layouts/user-reset', {
                title: '重设密码',
                userInfo: user
            });
        }
        res.render('layouts/user-reset', {
            title: '重设密码',
            userInfo: user
        });
    });
});

router.post('/reset/:token', function(req, res) {
    async.waterfall([
        function(done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                // console.log(user);
                if (!user) {
                    res.redirect('layouts/user-reset', {
                        title: '重设密码',
                        userInfo: user
                    });
                }
                var newpwd = req.body.newpassword;
                var checkpwd = req.body.confirmPwd;
                // console.log(req.body);
                if (newpwd !== checkpwd) {
                    res.json({ danger: '密码未匹配，请重新输入!' });
                    return false;
                } else {
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    user.password = newpwd;
                    user.save(function(err) {
                        done(err, user);
                    });

                }
            });
        },
        function(user, done) {
            var smtpTransport = nodemailer.createTransport({
                host: 'smtp.qq.com',
                secureConnection: true, // use SSL
                port: 465, // port
                auth: {
                    user: '78436058@qq.com',
                    pass: 'juhhdikhwlpnbhjd'
                }
            });
            var mailOptions = {
                to: user.email,
                from: '"传媒系管理员"<gegerihu@qq.com>',
                subject: '您的密码已经重设',
                text: '您好,\n\n' +
                    '您在呼和浩特民族学院传媒系注册的账户邮箱 ' + user.email + ' 已经重设密码.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                res.json({ success: '成功！您的密码已经重设。' });
                done(err);
            });
        }
    ], function(err) {
        res.redirect('/');
    });
});
//edit profile
router.get('/user/editprofile', function(req, res) {
    var id = req.session.user._id;
    // console.log(id);
    User.findById(id, function(err, user) {
        // console.log(user);
        req.session.user = user;
        if (err) {
            console.log(err);
        }
        res.render('layouts/editprofile', {
            title: '修改个人信息',
            user: user
        })
    })
})

router.post('/user/editprofile', function(req, res) {
    var id = req.session.user._id;
    var user = req.body.user;
    var userName = user.userName;
    var email = user.email;
    var phone = user.phoneNum;
    var errors = new Object();
    console.log(user);
    if (!validator.isEmail(email)) {
        errors.email = "请填写正确的邮箱地址!";
    }
    if (!validator.isNumeric(phone) || phone.length !== 11) {
        errors.phone = "请填写正确的手机号码!";
    }
    if (!isEmptyObject(errors)) {
        // console.log(errors);
        return res.json(errors);
    } else {
        User.findById(id, function(err, _user) {
            if (err) {
                throw err;
            }
            if (!_.isEqual(email, _user.email)) {
                console.log(email);
                User.findOne({ email: email }, function(err, email) {
                    if (email) {
                        errors.email = '填写邮箱已注册，请选择其他邮箱地址!';
                        return res.json(errors);
                    } else {
                        // _user = _.extend(_user, user)
                        _user.update(user, { w: 1 }, function(err, cb) {
                            if (err) {
                                throw err;
                            }
                            console.log(cb)
                            return res.json({ success: '用户信息修改成功!' });
                            req.session.user = _user;
                        })
                    }
                })
            } else {
                _user = _.extend(_user, user)
                console.log(_user)
                if (_user.isModified()) {
                    _user.update(user, { w: 1 }, function(err, cb) {
                        if (err) {
                            throw err;
                        }
                        console.log(cb)
                        return res.json({ success: '用户信息修改成功!' });
                        req.session.user = _user;
                    })
                } else {
                    return res.json({ danger: '请修改信息后再提交!' });
                }
            }
        })
    }
});

//resetpassword
router.post('/user/editprofile/resetpwd', function(req, res) {
    var id = req.session.user._id;
    var oldpwd = req.body.oldpassword;
    var newpwd = req.body.newpassword;
    checkpwd = req.body.confirmPwd;
    // console.log(req.body);
    if (newpwd !== checkpwd) {
        res.json({ danger: '密码未匹配，请重新输入!' });
        return false;
    } else {
        User.findOne({ _id: id }, function(err, user) {
            if (!user) {
                res.json({ danger: '用户不存在，请注册！' });
            } else {
                user.comparePassword(oldpwd, function(err, isMatch) {
                    // 密码匹配
                    if (isMatch) {
                        user.password = newpwd;
                        user.save(function(err) {
                            if (err) {
                                console.log(err);
                            }
                        })
                        // console.log(user.password);
                        return res.json({ success: '修改密码成功!' });
                    } else {
                        // 密码不匹
                        return res.json({ danger: '旧密码输入错误!' });
                    }
                });
            }
        })
    }
});

module.exports = router;