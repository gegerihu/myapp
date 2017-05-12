var express = require('express');
var router = express.Router();

/* GET website different page. */
router.get('/', function(req, res, next) {
  res.render('layouts/about', { title: '系部概况' });
});

router.get('/setting', function(req, res, next) {
  res.render('layouts/about', { title: '机构设置' });
});

module.exports = router;
