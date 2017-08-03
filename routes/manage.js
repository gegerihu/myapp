var express = require('express');
var _ = require('underscore');
var router = express.Router();
var Content = require("../models/Content");
var User = require("../models/User");
var Application = require("../models/Application");
var Carousel = require("../models/Carousel");
var mongoose = require('mongoose');
var moment = require('moment')
var multer = require('multer');
router.caseSensitive = true;
var smallimagestorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './public/upload/smallimages/');
    },
    filename: function(req, file, callback) {
        var fileFormat = (file.originalname).split(".");
        callback(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});
var smallimageupload = multer({ storage: smallimagestorage }).single('smallimage');

var carouselstorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './public/upload/carousel/');
    },
    filename: function(req, file, callback) {
        var fileFormat = (file.originalname).split(".");
        callback(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});
var carouselupload = multer({ storage: carouselstorage }).single('carousel');

function isAdminLogined(req) {
    return req.session.adminlogined;
}

// 后台登录 ------------------------------------------------------------------------------------------------------------------------------------
router.get(['/manage', '/manage/*'], function(req, res, next) {
    if (isAdminLogined(req)) {
        next();
    } else {
        res.redirect('/adminlogin');
    }
});
router.get('/adminlogin', function(req, res) {
    if (isAdminLogined(req)) {
        res.redirect('/manage')
    } else {
        res.render('layouts/admin-login', {
            title: '管理员登录界面'
        })
    }
});
//admin login
router.post('/adminlogin', function(req, res) {
    var name = req.body.user.userName;
    password = req.body.user.password;
    // remember=req.body.user.remember;
    // console.log(req.body.user);
    User.findOne({ userName: name }, function(err, user) {
        if (!user) {
            res.send('用户不存在，请注册！');
        } else {
            user.comparePassword(password, function(err, isMatch) {
                // 密码匹配
                if (isMatch) {
                    // if (remember) {
                    req.session.adminuser = user;
                    console.log(user.status);
                    if (user.status !== 3) { // 将当前登录用户名保存到session中
                        req.session.adminlogined = false;
                        console.log(req.session.adminlogined);
                        return res.send('您没有管理员权限!请联系管理员!');
                    } else {
                        req.session.adminlogined = true;
                        return res.send('登录成功!');
                    } // 登录成功
                } else {
                    // 账户名和密码不匹
                    return res.send('密码错误!');
                }
            });
        }
    })
})

//logout
router.get('/adminlogout', function(req, res) {
    delete req.session.adminuser;
    delete req.session.adminlogined;
    res.redirect('/');
});


//backend
router.get('/manage', function(req, res) {
    res.render('layouts/manage', {
        title: '后台管理'
    })
});
//-----------------------------------------------------------------------------------------------------------------------------------------------



// 文档管理相关------------------------------------------------------------------------------------------------------------------------------------

router.get('/manage/content/list', function(req, res) {
    Content.fetch(function(err, contents) {
        res.render('layouts/content-list', {
            title: '文档列表',
            contents: contents
        })
    })
})


router.get('/manage/content/addnew', function(req, res, next) {
    res.render('layouts/admin', {
        title: '录入新文档',
        content: {}
    });
});
router.get('/manage/content/carousel', function(req, res, next) {
    res.render('layouts/carousel', {
        title: '添加新图片',
        content: {}
    });
});


router.get('/manage/edit/:id', function(req, res, next) {
    var _id = req.params.id;
    // console.log(_id);

    Content.findById(_id, function(err, content) {
        // console.log(content);
        res.render('layouts/edit', {
            title: '编辑内容',
            content: content
        })
    })
})

router.post('/manage/edit/:id', function(req, res, next) {
    var _id = req.params.id;
    //console.log(_id);
    var docOjc = req.body.content;
    Content.findById(_id, function(err, doc) {
        if (doc) {
            doc = _.extend(doc, docOjc);
            if (doc.isModified()) {
                doc.save(function(err, newdoc) {
                    if (err) {
                        throw err;
                    }
                    console.log(newdoc);
                    res.json({ success: '编辑成功!' })
                })
            } else {
                res.json({ danger: '请修改后再提交!' })
            }
        } else {
            res.json({ danger: '编辑失败!' })
        }
    })
});


router.post('/addnew', function(req, res) {
    var contentObj = new Content(req.body.content);
    console.log(contentObj);
    if (contentObj.author === '') {
        contentObj.author = '传媒系'
    }
    contentObj.save(function(err) {
        if (err) {
            res.end(err);
        } else {
            id = contentObj._id
            res.json('录入成功！');
        }
    });

})


router.post('/uploadimg', function(req, res) {
    smallimageupload(req, res, function(err) {
        console.log(req.file)

        if (err) {
            return res.end("Error uploading file.");
        }
        if (req.file == undefined) {
            console.log('请选择上传文件！');
            res.send('请选择上传文件!');
            // res.redirect('/uploadimg')
        } else {
            res.end(req.file.filename);
        }
    });
});

router.post('/carouseluploadimg', function(req, res) {
    carouselupload(req, res, function(err) {
        console.log(req.file)

        if (err) {
            return res.end("Error uploading file.");
        }
        if (req.file == undefined) {
            console.log('请选择上传文件！');
            res.send('请选择上传文件!');
            // res.redirect('/uploadimg')
        } else {
            // console.log(req.file);
            res.end(req.file.filename);
        }
    });
});

router.post('/manage/carousel', function(req, res) {
    var carousel = new Carousel(req.body.image);
    console.log(req.body);
    console.log(carousel);
    carousel.save(function(err) {
        if (err) {
            throw err;
        }
        res.end('提交成功!');
    })
})


//
//list delete
router.delete('/manage/content/list', function(req, res) {
    var id = req.query.id
    if (id) {
        Content.remove({ _id: id }, function(err, content) {
            if (err) {
                console.log(err)
            } else {
                res.json({
                    success: 1
                })
            }
        })
    }
});
//--------------------------------------------------------------------------------------------------------------

//实验室管理相关-------------------------------------------------------------------------------------------------
//applications list
router.get('/manage/application/list', function(req, res) {
    Application.find({}).sort({ date: -1 }).populate('user').exec(function(err, forms) {
        if (err) {
            throw err;
        }
        res.render('layouts/applications-list', {
            title: '申请列表',
            listname: '所有申请列表',
            forms: forms
        });
    });
})
router.get('/manage/application/overduelist', function(req, res) {
    var nowDate = moment(Date.now()).format('YYYY-MM-DD dddd a h:MM');
    var forms;

    Application.update({ returnTime: { $lte: nowDate }, state: 0 }, { $set: { state: 3 } }, { multi: true }, function(err, raw) {
        if (err) return handleError(err);
        console.log('The raw response from Mongo was ', raw);
    });
    console.log(nowDate);
    Application.find({ state: 3 }).sort({ date: -1 }).populate('user').exec(function(err, forms) {
        if (err) {
            throw err;
        }
        res.render('layouts/applications-list', {
            title: '过期未还列表',
            listname: '过期未还列表',
            forms: forms
        });
    });
})

router.get('/manage/overdue-app-count', function(req, res) {
    Application.count({ state: 3 }, function(err, count) {
        if (err) {
            throw err;
        }
        // console.log(count);
        res.json(count);
    });
})

router.get('/manage/application/:id', function(req, res) {
    var id = req.params.id;
    Application.findOne({ _id: id }).populate('user').exec(function(err, form) {
        if (err) {
            throw err;
        }
        res.render('layouts/app-examine', {
            title: '申请审批',
            form: form
        });
    });
})
router.get('/manage/newapplication', function(req, res) {
    Application.find({ state: 4 }).populate('user').exec(function(err, forms) {
        if (err) {
            throw err;
        }
        // console.log(forms);
        res.render('layouts/applications-list', {
            title: '新到申请',
            listname: '新到申请',
            forms: forms
        });
    });
})
router.get('/manage/new-app-count', function(req, res) {
    Application.count({ state: 4 }, function(err, count) {
        if (err) {
            throw err;
        }
        // console.log(count);
        res.json(count);
    });
});

//application examine
router.post('/app-examine/:id', function(req, res) {
    var id = req.params.id;
    var state = req.body.state;
    comment = req.body.comment;
    extendTime = req.body.extendTime;
    Application.update({ _id: id }, { $set: { state: state, comment: comment, returnTime: extendTime } }, function(err, cb) {
        if (err) {
            throw err;
        }
        console.log(cb);
        res.json(req.body);
    })

})

router.delete('/manage/app-list', function(req, res) {
    var id = req.query.id
    if (id) {
        Application.remove({ _id: id }, function(err, content) {
            if (err) {
                console.log(err)
            } else {
                res.json({
                    success: 1
                })
            }
        })
    }
});
//------------------------------------------------------------------------------------------------------------------------------------------

// 用户管理---------------------------------------------------------------------------------------------------------------------------------------
router.get('/manage/user/list', function(req, res) {
    User.fetch(function(err, users) {
        res.render('layouts/user-list', {
            listTitle: '所有用户列表',
            title: '所有用户列表',
            users: users
        })
    })
})
// new user
router.get('/manage/user/new', function(req, res) {
    User.find({ state: false }).sort({ date: -1 }).exec(function(err, users) {
        res.render('layouts/user-list', {
            listTitle: '新注册用户列表',
            title: '新注册用户列表',
            users: users
        })
    })
});


router.get('/manage/user/new-user-count', function(req, res) {
    User.count({ state: false }, function(err, counter) {
        if (err) {
            console.log(err);
        }
        // console.log(count);
        res.json(counter);
    })
});
// user detail
router.get('/manage/userdetail/:id', function(req, res) {
    var id = req.params.id;
    User.findById(id, function(err, user) {
        if (err) {
            throw err;
        }
        user.update({ $set: { state: true } }, { w: 1 }, function(err, cb) {
            console.log(cb);
        });
        Application.count({ user: id }, function(err, count) {
            if (err) {
                throw err;
            }
            // console.log(count);
            res.render('layouts/user-detail', {
                title: '用户信息详情',
                user: user,
                count: count
            });
        });
    });
})
router.post('/manage/user/:id/editprofile', function(req, res) {
    var id = req.params.id;
    // console.log(req.body);
    var user = req.body.user;
    User.findOneAndUpdate({ _id: id }, { $set: user }, { new: true }, function(err, cb) {
        if (err) {
            console.log(err);
        }
        console.log(cb);
        req.session.user = cb;
    });
    res.send('修改成功!');
});

router.post('/manage/user/:id/resetpwd', function(req, res) {
    var id = req.params.id;
    var newpwd = req.body.newpassword;
    var checkpwd = req.body.confirmPwd;

    if (newpwd !== checkpwd) {
        res.json({ danger: '密码未匹配，请重新输入!' });
        return false;
    } else {
        User.findOne({ _id: id }, function(err, user) {
            if (!user) {
                res.json({ danger: '用户不存在，请注册!' });
            } else {
                user.password = newpwd;
                user.save(function(err) {
                    if (err) {
                        console.log(err);
                    }
                })
                return res.json({ success: '修改密码成功!' });

            };
        })
    }
});
// user app list
router.get('/manage/user/:id/applist', function(req, res) {
    var id = req.params.id;
    console.log(id);

    Application.find({ user: id }).populate('user').sort({ date: -1 }).exec(function(err, forms) {
        if (err) {
            throw err;
        }
        //console.log(forms[0].user.name);
        User.findById(id, function(err, user) {
            res.render('layouts/applications-list', {
                title: '用户申请列表',
                listname: user.name + '的所有申请',
                forms: forms
            })
        });
    });
})
// delete user
router.delete('/manage/userlist', function(req, res) {
    var id = req.query.id;
    console.log(id);
    if (id) {
        User.remove({ _id: id }, function(err, content) {
            if (err) {
                console.log(err)
            } else {
                res.json({
                    success: 1
                })
            }
        })
    }
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// manage page get count for chart-----------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
router.get('/manage/user/user-week-count/:index', function(req, res) {
    function getMonday() {
        var d = new Date();
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        d.setDate(diff);
        return d;
    }
    var mondayOfweek = getMonday();
    mondayOfweek.setHours(8, 0, 0, 0);
    var i = req.params.index;
    if (i == 0) {
        console.log('monday=' + mondayOfweek);
        User.count({ date: { $gte: mondayOfweek } }, function(err, count) {
            if (err) {
                throw err;
            }
            return res.json(count);
            console.log('count=' + count);
        });
    } else {
        var weekGt = new Date(+(mondayOfweek) - 7 * 24 * 60 * 60 * 1000 * i);
        var weekLt = new Date(+(mondayOfweek) - 7 * 24 * 60 * 60 * 1000 * (i - 1));
        User.count({ date: { $gte: weekGt, $lte: weekLt } }, function(err, count) {
            if (err) {
                throw err;
            }
            return res.json(count);
            console.log('count=' + count);
        });
    }
    return false;
});

router.get('/manage/user/application-week-count/:index', function(req, res) {
    function getMonday() {
        var d = new Date();
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        d.setDate(diff);
        return d;
    }
    var mondayOfweek = getMonday();
    mondayOfweek.setHours(8, 0, 0, 0);
    var i = req.params.index;
    if (i == 0) {
        console.log('monday=' + mondayOfweek);
        Application.count({ date: { $gte: mondayOfweek } }, function(err, count) {
            if (err) {
                throw err;
            }
            return res.json(count);
            console.log('count=' + count);
        });
    } else {
        var weekGt = new Date(+(mondayOfweek) - 7 * 24 * 60 * 60 * 1000 * i);
        var weekLt = new Date(+(mondayOfweek) - 7 * 24 * 60 * 60 * 1000 * (i - 1));
        Application.count({ date: { $gte: weekGt, $lte: weekLt } }, function(err, count) {
            if (err) {
                throw err;
            }
            return res.json(count);
            console.log('count=' + count);
        });
    }
    return false;
});

router.get('/manage/user/content-week-count/:index', function(req, res) {
    function getMonday() {
        var d = new Date();
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        d.setDate(diff);
        return d;
    }
    var mondayOfweek = getMonday();
    mondayOfweek.setHours(8, 0, 0, 0);
    var i = req.params.index;
    if (i == 0) {
        console.log('monday=' + mondayOfweek);
        Content.count({ 'meta.createDate': { $gte: mondayOfweek } }, function(err, count) {
            if (err) {
                throw err;
            }
            return res.json(count);
            console.log('count=' + count);
        });
    } else {
        var weekGt = new Date(+(mondayOfweek) - 7 * 24 * 60 * 60 * 1000 * i);
        var weekLt = new Date(+(mondayOfweek) - 7 * 24 * 60 * 60 * 1000 * (i - 1));
        Content.count({ 'meta.createDate': { $gte: weekGt, $lte: weekLt } }, function(err, count) {
            if (err) {
                throw err;
            }
            return res.json(count);
            console.log('count=' + count);
        });
    }
    return false;
});
router.get('/manage/user/content-category-count', function(req, res) {
    var num = [];
    Content.count({ category: '新闻动态' }, function(err, count_1) {
        num.push(count_1);
        console.log(count_1)
        Content.count({ category: '教学活动' }, function(err, count_2) {
            num.push(count_2);
            console.log(count_2)
            Content.count({ category: '规章制度' }, function(err, count_3) {
                console.log(count_3)
                num.push(count_3); //res.json(num);
                Content.count({ category: '学生作品' }, function(err, count_4) {
                    console.log(count_4)
                    num.push(count_4);
                    Content.count({ category: '下载文档' }, function(err, count_5) {
                        console.log(count_5);
                        num.push(count_5);
                        res.json(num);
                    })
                })
            })
        })
    })
});
router.get('/manage/user/app-state-count', function(req, res) {
    var num = [];
    Application.count({ state: 0 }, function(err, count_1) {
        num.push(count_1);
        console.log(count_1)
        Application.count({ state: 1 }, function(err, count_2) {
            num.push(count_2);
            console.log(count_2)
            Application.count({ state: 2 }, function(err, count_3) {
                console.log(count_3)
                num.push(count_3); //res.json(num);
                Application.count({ state: 3}, function(err, count_4) {
                    console.log(count_4)
                    num.push(count_4);
                    Application.count({ state: 4 }, function(err, count_5) {
                        console.log(count_5);
                        num.push(count_5);
                        res.json(num);
                    })
                })
            })
        })
    })
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports = router;