var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('layouts/bootswatch', { title: '传媒系' ,
        documentList:[{
    title:'关于大大大所大大打算打算大的1',
    img:'http://www.html-js.cn/upload/smallimgs/img20160515113840.jpg',
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
    }]
});
});

router.get('/news', function(req, res, next) {
  res.render('layouts/news', { title: '传媒系' ,
    documentList:[{
    title:'关于大大大所大大打算打算大的1',
    img:'http://www.html-js.cn/upload/smallimgs/img20160515113840.jpg',
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
    }]
   });
});
module.exports = router;

