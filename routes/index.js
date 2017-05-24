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
  res.render('layouts/bootswatch', { title: '传媒系' ,
        documentList:[{
    title:'关于大大大所大大打算打算大的1',
    img:'/images/1.jpg',
    date: 222,
    },
    {
    title:'关于大大大所大大打算打算大的2',
    img:'/images/1.jpg',
    date: 333,
    },
    {
    title:'关于大大大所大大打算打算大的3',
    img:'/images/1.jpg',
    date: 444,
    },
    {
    title:'关于大大大所大大打算打算大的4',
    img:'/images/1.jpg',
    date: 444,
    }]
});
});

router.get('/news', function(req, res) {
    Content.fetch(function(err,contents){
        if (err) {
            console.log(err)};
        res.render('layouts/news', { 
            title: '新闻动态' ,
            contents:contents
        })
    })
})


router.get('/admin', function(req, res, next) {
  res.render('layouts/admin', { title: '后台管理' ,
    content:{
    }  
    });
});

router.get('/news/:id', function(req, res, next) {
    var _id = req.params.id;
    console.log(_id);
    Content.update({_id:_id},{$inc:{clickNum:1}},function(err) {
    if(err) {
      console.log(err);
        }
    });
    Content.findById(_id,function(err,content){
        console.log(content);
    res.render('layouts/details', { title: '新闻详情' ,
        content:content
        })
    })
})

router.post('/admin',function(req,res){

    // var title=req.body.content;
    console.log(req.body);
    // res.send('OK');
    var contentObj= new Content(req.body.content);
    contentObj.save(function(err){
            if(err){
                res.end(err);
            }else{
                res.end("success");
            }
        });

    // console.log(req.body);
    // 
    // var id = req.body.content._id,
    //     contentObj = req.body.content,
    //     _content;username
    //     // if (id !== 'undefined') {
    //     //     Content.findById(id, function(err, content){
    //     //         if (err) {
    //     //             console.log(err);                    
    //     //         }
    //     //         _content=_.extend(content, contentObj) ;
    //     //         _content.save(function(err, content){
    //     //             if (err) {
    //     //                 console.log(err);
    //     //             }
    //     //             //res.redirect('/news/'+ content.id)
    //     //             res.send('Scucess');
    //     //         })
    //     //     })
    //     // }
    //     // else {
    //     _contnet = new Content({
    //         title:contentObj.title,
    //         author:contentObj.author,
    //         description:contentObj.description,
    //         mainContent:contentObj.mainContent
    //     })
    //     _content.save(function(err,content){
    //         if (err) {
    //                 console.log(err);
    //             }
    //         res.send('Success');
    //            // res.redirect('/news/'+ content.id)
    //     })
    // //    }
})

module.exports = router;

