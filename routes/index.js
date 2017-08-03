var express = require('express');
var _ = require('underscore');
var router = express.Router();
var Content = require("../models/Content");
var User = require("../models/User");
var Application = require("../models/Application");
var Carousel = require("../models/Carousel");
var mongoose = require('mongoose');
var moment = require('moment')


/* GET home page. */
router.get('/', function(req, res, next) {
    var condition = {
        category: '新闻动态'
    }
    var options = {
        sort: { 'meta.updateDate': -1 },
        lean: true,
        offset: 0,
        limit: 8
    };
    Content.paginate(condition, options, function(err, result) {
        if (err) {
            console.log(err);
        }
        Carousel.find({}).sort({ date: -1 }).limit(3).skip(2).exec(function(err, carousels) {
            // console.log(result.docs);
            // console.log(carousels);
            res.render('layouts/bootswatch', {
                title: '传媒系',
                documentList: result.docs,
                carousels: carousels
                // user:user
            })
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
    options.offset = (pageNum * options.limit) - options.limit;
    Content.paginate({ category: '新闻动态' }, options, function(err, result) {
        if (err) {
            console.log(err)
        };
        // res.send(result);
        res.render('layouts/pageContent', {
            // title: '新闻动态' ,
            contents: result.docs
        }, function(err, html) {
            res.send(html);
        })

    })
});


router.get('/pagenumber/:category', function(req, res) {
    var category = req.params.category
    Content.count({ category: category }, function(err, result) {
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
        title: '实验室管理',
    })
})


router.get('/news/:id', function(req, res, next) {
    var _id = req.params.id;
    // console.log(_id);
    Content.update({ _id: _id }, { $inc: { clickNum: 1 } }, function(err) {
        if (err) {
            console.log(err);
        }
    });
    Content.findOne({ _id:_id }, function(err, content) {
        if (err) {
            console.log(err);
        }
        res.render('layouts/details', {
            title: '新闻详情',
            content: content
        })
    })
})



module.exports = router;