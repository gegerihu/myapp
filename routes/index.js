var express = require('express');
var _ =require('underscore');
var router = express.Router();
var Content = require("../models/Content");
var  mongoose = require('mongoose');

router.get('/signup', function(req, res, next) {
  res.render('layouts/signup', { title: '机构设置' });
});


router.post('/signup',function(req,res){
    var username = req.body.Email;
    var password = req.body.Password;
    console.log("post received: %s %s", username, password);
    res.send('success!');
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
            documentList: result.docs

        })
    })
});
    


router.get('/news/page/:pageNum', function(req, res, next) {
    var pageNum = req.params.pageNum
    var options = {
            sort: { 'meta.updateDate': -1 },        
            lean: true,
            offset: 20, 
            limit: 6
            };
    options.offset=(pageNum*options.limit)-options.limit;
    Content.paginate({}, options, function(err, result) {
        if (err) {
            console.log(err)};
       // res.send(result);
        res.render('layouts/pageContent', { 
            title: '新闻动态' ,
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
            title: '新闻动态' ,
        })
    })

router.get('/list', function(req, res) { 
        Content.fetch(function(err,contents){ 
        res.render('layouts/list', { 
            title: '文档列表' ,
            contents:contents
            })
        })
    }) 

router.get('/sidebar', function(req, res, next) {
  res.render('layouts/sidebar', { title: '后台管理' ,
    content:{
    }  
    });
});

router.get('/admin', function(req, res, next) {
  res.render('layouts/admin', { title: '后台管理' ,
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
        if (err) {
        console.log(err);}
    res.render('layouts/details', { title: '新闻详情' ,
        content:content
        })
    })
})
router.get('/sidebar/:id', function(req, res, next) {
    var _id = req.params.id;
    // console.log(_id);
    
    Content.findById(_id,function(err,content){
        // console.log(content);
    res.render('layouts/edit', { title: '编辑内容' ,
        content:content
        })
    })
})

router.post('/sidebar/:id', function(req, res, next) {
    var _id = req.params.id;
    //console.log(_id);
    var contentObj= new Content(req.body.content);
    Content.update({_id:_id},contentObj,function(err){
         // console.log(this);
    res.redirect('/list')
    })
})


router.post('/admin',function(req,res){
    var contentObj= new Content(req.body.content);
    if(contentObj.author === ''){
            contentObj.author = '传媒系'
        }
    contentObj.save(function(err){
            if(err){
                res.end(err);
            }else{
                res.redirect('/list');
            }
        });

})

//list delete
router.delete('/list',function(req,res){
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

module.exports = router;

