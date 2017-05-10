var express = require('express');
var router = express.Router();

/* GET website different page. */
router.get('/', function(req, res, next) {
  res.render('aboutus', { title: '系部概况' });
});

router.get('/setting', function(req, res, next) {
  res.render('aboutus/setting', { title: '机构设置' });
});

router.get('/lecturers', function(req, res, next) {
  res.render('aboutus/lecturers', { title: '师资队伍' });
});


module.exports = router;
