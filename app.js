var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session'); // session依赖cookie模块
var mongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var moment = require('moment');
var index = require('./routes/index');
var users = require('./routes/users');
// var about = require('./routes/about');
var manage = require('./routes/manage');
var app = express();

mongoose.Promise = global.Promise;

app.locals.moment = require('moment');
moment.locale('zh-cn');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('view options', { debug: true });
if (app.get('env') === 'development') {
  app.locals.pretty = true;
}
mongoose.connect('mongodb://127.0.0.1:27017/myapp');
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', '/icon/chuanmeixi.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.use(session({
    secret: 'myapp', // 设置的secret字符串，来计算hash值并放在cookie中
    resave: false, // session变化才进行存储
    saveUninitialized: true,
    // 使用mongo对session进行持久化，将session存储进数据库中
    store: new mongoStore({
        url: 'mongodb://127.0.0.1:27017/myapp', // 本地数据库地址
        collection: 'sessions' // 存储到mongodb中的字段名
    })
}));

var ueditor = require('ueditor-nodejs');
app.use('/ueditor/ue', ueditor({ //这里的/ueditor/ue是因为文件件重命名为了ueditor,如果没改名，那么应该是/ueditor版本号/ue
    configFile: '/ueditor/jsp/config.json', //如果下载的是jsp的，就填写/ueditor/jsp/config.json
    mode: 'local', //本地存储填写local
    accessKey: '', //本地存储不填写，bcs填写
    secrectKey: '', //本地存储不填写，bcs填写
    staticPath: path.join(__dirname, 'public'), //一般固定的写法，静态资源的目录，如果是bcs，可以不填
    //dynamicPath: dynamicPath//动态目录，以/开头，bcs填写buckect名字，开头没有/.路径可以根据req动态变化，可以是一个函数，function(req) { return '/xx'} req.query.action是请求的行为，uploadimage表示上传图片，具体查看config.json.
}));
app.use(function(req, res, next) {
    app.locals.user = req.session.user;
    app.locals.adminuser = req.session.adminuser;
    app.locals.adminlogined = req.session.adminlogined;
    next();
});

app.use('/', manage);
app.use('/', index);
app.use('/', users);


app.use(function(err, req, res, next) {

    // very basic!
    console.error(err.stack);

    // show user some message - for Ajax requests which expects a specific format
    res.send(JSON.stringify({ok: false, message: err.message}));


    // OR

    // more advanced:
    // check error type, context etc. and act accordingly
    // - log message
    // - send appropriaty error page etc.
    // - eventually use next handler
    // - set res.status
    // sth. like this

    if (req.xhr) {
      res.status(500).send({ error: 'Something failed!' });
    } else {
      next(err);
    }
});

// catch 404 and forward to error handler

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.locals.myDateFormat = function(date) {
    moment.locale('zh-cn');
    return moment(date).startOf('hour').fromNow();
};

app.locals.searchKeyWord = function(content, key) {
    var newContent = content;
    if (newContent && key) {
        var keyword = key.replace(/(^\s*)|(\s*$)/g, "");
        if (keyword != '') {
            var reg = new RegExp(keyword, 'gi');
            newContent = content.replace(reg, '<span style="color:red">' + key + '</span>');
        }
    }
    return newContent;
};
// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;