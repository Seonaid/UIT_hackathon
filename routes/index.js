var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'ConnecTeen' });
});

router.get('/story', function(req, res){
	res.render('story')
});

router.post('/story', function(req, res){
	console.log('adding story to database');
	res.render('index', {title: 'Success!'});
});

module.exports = router;
