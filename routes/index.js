var express = require('express');
var _ =require('underscore');
var router = express.Router();
var Content = require("../models/Content");
var User = require("../models/User");
var Application = require("../models/Application");
var mongoose = require('mongoose');
var multer  =   require('multer');
router.caseSensitive = true;
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/upload/smallimages/');
  },
  filename: function (req, file, callback) {
    var fileFormat = (file.originalname).split(".");
    callback(null, file.fieldname + '-' + Date.now()+ "." + fileFormat[fileFormat.length - 1]);
  }
});
var smallimageupload = multer({ storage : storage}).single('smallimage');

function isAdminLogined(req){
    return req.session.adminlogined;
}

router.get(['/manage','/manage/*'],function(req,res,next){
    if(isAdminLogined(req)){
        next();
    }else{
        res.redirect('/adminlogin');
   }
});
router.get('/adminlogin',function(req,res){
   if(isAdminLogined(req)){
        res.redirect('/manage')
    }else{
        res.render('layouts/admin-login',{
        title:'管理员登录界面'
        })
    }
});


/* GET home page. */
router.get('/', function(req, res, next) {
    var condition={
        category:'新闻动态'
            }
    var options = {
            sort: { 'meta.updateDate': -1 },
            lean: true,
            offset: 0,
            limit: 8
            };
    Content.paginate(condition,options,function(err, result){
        if (err) {
            console.log(err);
            }
        res.render('layouts/bootswatch',{
            title:'传媒系',
            documentList: result.docs,
            // user:user
        })
    })
});

router.get('/news/page/:pageNum', function(req, res, next) {
    var pageNum = req.params.pageNum
    var options = {
            sort: { 'meta.updateDate': -1 },
            lean: true,
            offset: 0,
            limit: 6
            };
    options.offset=(pageNum*options.limit)-options.limit;
    Content.paginate({}, options, function(err, result) {
        if (err) {
            console.log(err)};
       // res.send(result);
        res.render('layouts/pageContent', {
            // title: '新闻动态' ,
            contents:result.docs
        }, function(err, html) {
            res.send(html);
})

    })
});


router.get('/pagenumber', function(req, res) {
    Content.count({}, function(err, result) {
        var pageNumber = {};
        // console.log(result+"pagenumber");
        pageNumber.total = result;
        res.send(pageNumber);
    });
});

router.get('/news', function(req, res) {
        res.render('layouts/news', {
            title: '新闻动态'
        })
    })

router.get('/labmanage', function(req, res) {
        res.render('layouts/labmanage', {
            title: '实验室管理' ,
        })
    })

router.get('/manage/content/list', function(req, res) {
        Content.fetch(function(err,contents){
        res.render('layouts/content-list', {
            title: '文档列表' ,
            contents:contents
            })
        })
    })


router.get('/manage/content/addnew', function(req, res, next) {
  res.render('layouts/admin', { title: '录入新文档' ,
    content:{}
    });
});
router.get('/manage/content/carousel', function(req, res, next) {
  res.render('layouts/carousel', { title: '添加新图片' ,
    content:{}
    });
});

router.get('/news/:id', function(req, res, next) {
    var _id = req.params.id;
    // console.log(_id);
    Content.update({_id:_id},{$inc:{clickNum:1}},function(err) {
    if(err) {
      console.log(err);
        }
    });
    Content.findById(_id,function(err,content){
        if (err){
        console.log(err);
        }
        res.render('layouts/details', { title: '新闻详情' ,
        content:content
        })
    })
})
router.get('/manage/edit/:id', function(req, res, next) {
    var _id = req.params.id;
    // console.log(_id);

    Content.findById(_id,function(err,content){
        // console.log(content);
    res.render('layouts/edit', { title: '编辑内容' ,
        content:content
        })
    })
})

router.post('/manage/edit/:id', function(req, res, next) {
    var _id = req.params.id;
    //console.log(_id);
    var contentObj= new Content(req.body.content);
    Content.update({_id:_id},contentObj,function(err){
         // console.log(this);
    res.redirect('/manage/content/list')
    })
});


router.post('/admin',function(req,res){
    var contentObj= new Content(req.body.content);
    console.log(contentObj);
    if(contentObj.author === ''){
            contentObj.author = '传媒系'
        }

    contentObj.save(function(err){
            if(err){
                res.end(err);
            }else{
                id= contentObj._id
                res.redirect('/news/'+id);
            }
        });

})

//upload image
router.get('/uploadimg', function(req, res, next) {
  res.render('layouts/upload', { title: '后台管理' ,content:{}
    });
});




router.post('/uploadimg',function(req,res){
    smallimageupload(req,res,function(err) {
        console.log(req.file)

        if(err) {
            return res.end("Error uploading file.");
        }
        if(req.file == undefined){
            console.log('请选择上传文件！');
            res.send('请选择上传文件!');
            // res.redirect('/uploadimg')
        }
        else {
            res.end(req.file.filename);
        }
    });
});



//list delete
router.delete('/manage/content/list',function(req,res){
    var id = req.query.id
    if (id) {
        Content.remove({_id:id},function(err, content){
            if (err) {
                console.log(err)
            }
            else{
                res.json({
                    success: 1
                })
            }
        })
    }
})

//signup
router.post('/signup',function(req,res){
    var user = req.body.user ;
    var password=user.password;
    var confirmPwd=user.confirmPwd;
    var name= user.userName;
    var email= user.email;
    var errors;
    User.find({$or:[{'userName':name},{'email':email}]},function(err, docs){

    if (docs.length > 0) {
        errors = '用户名或邮箱已注册,请重新填写！';
    }
    if (password!==confirmPwd)  {
        errors='密码未匹配，请重新输入!';
    }
    if (errors) {
        res.end(errors);
    }
    else {
        var user= new User(req.body.user);
        console.log(user);
        user.save(function(err){
            // console.log(err);
            if(err){
                res.end(err);
            }else{
                console.log('success!');
                res.end('注册成功!');
                }
            });
            }
        })
     });
//login
router.post('/adminlogin',function(req,res){
    var name=req.body.user.userName;
        password=req.body.user.password;
        // remember=req.body.user.remember;
    console.log(req.body.user);
    User.findOne({userName:name},function(err, user){
        if (!user) {
            res.send('用户不存在，请注册！');
        }
        else{
            user.comparePassword(password,function(err,isMatch) {
              // 密码匹配
                if(isMatch) {
                    // if (remember) {
                    req.session.user = user;
                    console.log(user.status);
                    if(user.status =='0'){  // 将当前登录用户名保存到session中
                        req.session.adminlogined = false;
                        console.log(req.session.adminlogined);
                        return res.send('您没有管理员权限!请联系管理员!');
                    }else{
                        req.session.adminlogined = true;
                        return res.send('登录成功!');
                    }            // 登录成功
              }else {
                // 账户名和密码不匹
                return res.send('密码错误!');
              }
            });
        }
    })
})
router.post('/login',function(req,res){
    var name=req.body.user.userName;
        password=req.body.user.password;
        // remember=req.body.user.remember;
    console.log(req.body.user);
    User.findOne({userName:name},function(err, user){
        if (!user) {
            res.send('用户不存在，请注册！');
        }
        else{
            user.comparePassword(password,function(err,isMatch) {
              // 密码匹配
                if(isMatch) {
                    // if (remember) {
                    req.session.user = user;
                    //req.session.adminlogined = true;
                    return res.send('登录成功!');
                    // 登录成功
                }else {
                // 账户名和密码不匹
                return res.send('密码错误!');
                }
            });
        }
    })
});


//logout
router.get('/logout',function(req,res){
    delete req.session.user;
    delete req.session.adminlogined;
    res.redirect('/');
});

//application post
router.post('/application',function(req,res){

    var form = new Application(req.body.application);
    console.log(req.body.application);
    form.save(function(err){
            if(err){
                res.end(err);
            }else{
                res.end('申请成功!');
            }
        });

})
//user application list
router.get('/user/applist',function(req,res){
    var id = req.session.user._id;
    // console.log(id);
    // res.render('layouts/applist',{title:'申请列表'})

    Application.find({user:id},function(err,forms){
        // console.log(forms);
        res.render('layouts/applist',{
            title:'申请列表',
            forms:forms
            })
        });
})
router.get('/user/appdetail/:id',function(req,res){
    var _id=req.params.id;
        userId= req.session.user._id;
    console.log(_id);

    Application.findOne({_id:_id},function(err,form){
         User.findById(userId,function(err, user){
            console.log(form);
            res.render('layouts/appdetail' ,{
            title:'申请表详情',
            form:form,
            user:user
            })
        })
    })
})
//edit profile
router.get('/user/editprofile',function(req,res){
    var id= req.session.user._id;
    console.log(id);
    User.findById(id,function(err,user){
        console.log(user);
        req.session.user= user;
        if (err) {
            console.log(err);
        }
        res.render('layouts/editprofile',{
            title:'修改个人信息',
            user:user
        })
    })
})

router.post('/user/editprofile',function(req,res){
    var id = req.session.user._id||req.body.user._id;
    var user= req.body.user;
    console.log(user);
    User.findOneAndUpdate({_id:id},{$set:user},{new:true},function(err,cb){
        if (err) {
            console.log(err);
        }
        console.log(cb);
        req.session.user=cb;
    });
    // req.session.user;
        res.send('修改成功!');
})
//resetpassword
router.post('/user/editprofile/resetpwd',function(req,res){
    var id = req.session.user._id;
    var oldpwd= req.body.oldpassword;
    var newpwd= req.body.newpassword;
        checkpwd =req.body.confirmPwd;
        console.log(req.body);
    if (newpwd !== checkpwd) {
        res.end('密码未匹配，请重新输入!');
        return false;
    }
    else{
        User.findOne({_id:id},function(err, user){
        if (!user) {
            res.end('用户不存在，请注册！');
        }
        else{
            user.comparePassword(oldpwd,function(err,isMatch) {
              // 密码匹配
                if(isMatch) {
                    bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt) {
                    if(err) {
                        console.log(err);
                    }
                    bcrypt.hash(newpwd,salt,function(err,hash) {
                        if(err) {
                            console.log(err);
                        }
                        newpwd = hash;                          // 将hash后的密码赋值到当前用户密码
                        console.log(newpwd);
                        user.update({$set:{password:newpwd}},{w:1},function(err,cb){
                            console.log(cb);
                        });
                    });
                });
                    console.log(user.password);
                    return res.end('修改密码成功!');
                }else {
                // 密码不匹
                    return res.end('旧密码输入错误!');
                    }
                });
            }
        })
    }
});
//backend
router.get('/manage',function(req,res){
    res.render('layouts/sidebar',{
        title:'后台管理'
    })
});
//applications list
router.get('/manage/application/list',function(req,res){
    Application.find({}).populate('user').exec(function(err, forms){
        if (err) {
            throw err;
        }
        res.render('layouts/applications-list',{
            title:'申请列表',
            forms:forms
        });
    });
})
router.get('/manage/application/:id',function(req,res){
    var id= req.params.id;
    Application.findOne({_id:id}).populate('user').exec(function(err, form){
        if (err) {
            throw err;
        }
        res.render('layouts/app-examine',{
            title:'申请列表',
            form:form
        });
    });
})
router.get('/manage/newapplication',function(req,res){
    Application.find({state:4}).populate('user').exec(function(err, forms){
        if (err) {
            throw err;
        }
        console.log(forms);
        res.render('layouts/newapplication',{
            title:'申请列表',
            forms:forms
        });
    });
})
router.get('/manage/new-app-count',function(req,res){
    Application.count({state:4},function(err, count){
        if (err) {
            throw err;
        }
        console.log(count);
        res.json(count);
    });
});

//application examine
router.post('/app-examine/:id',function(req,res){
    var id= req.params.id;
    var state= req.body.state;
        comment=req.body.comment;
    Application.update({_id:id},{$set:{state:state,comment:comment}},function(err,cb){
        if (err) {
            throw err;
        }
        console.log(cb);
        res.send('审批完成!');
    })

})
// 用户管理
router.get('/manage/user/list', function(req, res) {
        User.fetch(function(err,users){
        res.render('layouts/user-list', {
            title: '用户列表' ,
            users:users
            })
        })
    })
// new user
router.get('/manage/user/new', function(req, res) {
        User.find({state:false},function(err,users){
        res.render('layouts/user-list', {
            title: '用户列表' ,
            users:users
            })
        })
    })
// user detail
router.get('/manage/user/:id',function(req,res){
    var id= req.params.id;
    User.findById(id,function(err, user){
        if (err) {
            throw err;
        }
        user.update({$set:{state:true}},{w:1},function(err,cb){
                    console.log(cb);
            });
        Application.count({user:id},function(err, count){
        if (err) {
            throw err;
        }
        console.log(count);
        res.render('layouts/user-detail',{
            title:'用户信息详情',
            user:user,
            count: count
            });
        });
    });
})
router.post('/manage/user/:id/editprofile',function(req,res){
    var id = req.params.id;
    console.log(req.body);
    var user= req.body.user;
    User.findOneAndUpdate({_id:id},{$set:user},{new:true},function(err,cb){
        if (err) {
            console.log(err);
        }
        console.log(cb);
        req.session.user=cb;
    });
        // req.session.user;
        res.send('修改成功!');
});

router.post('/manage/user/:id/resetpwd',function(req,res){
    var id= req.params.id;
    var newpwd= req.body.newpassword;
        checkpwd =req.body.confirmPwd;
        console.log(req.body);
    if (newpwd !== checkpwd) {
        res.end('密码未匹配，请重新输入!');
        return false;
    }
    else{
        User.findOne({_id:id},function(err, user){
        if (!user) {
            res.end('用户不存在，请注册！');
        }
        else{
            bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt) {
            if(err) {
                console.log(err);
            }
            bcrypt.hash(newpwd,salt,function(err,hash) {
                if(err) {
                    console.log(err);
                }
                newpwd = hash;                          // 将hash后的密码赋值到当前用户密码
                console.log(newpwd);
                user.update({$set:{password:newpwd}},{w:1},function(err,cb){
                    console.log(cb);
                });
            });
        });
            console.log(user.password);
            return res.end('修改密码成功!');

                };
            })
    }
});
// user app list
router.get('/manage/user/:id/applist',function(req,res){
    var id= req.params.id;
    console.log(id);
    Application.find({user:id}).populate('user').exec(function(err, forms){
        if (err) {
            throw err;
        }
        console.log(forms);
        res.render('layouts/applications-list',{
            title: '申请列表',
            forms:forms
        });
    });
})
// delete user
router.delete('/manage/userlist',function(req,res){
    var id = req.query.id;
    console.log(id);
    if (id) {
        User.remove({_id:id},function(err, content){
            if (err) {
                console.log(err)
            }
            else{
                res.json({
                    success: 1
                })
            }
        })
    }
});


module.exports = router;

