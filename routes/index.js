var express = require('express');
var router = express.Router();
var pg = require('pg');

var postgres = require('../lib/postgres');
console.log(postgres);


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'ConnecTeen' });
});

router.get('/story', function(req, res){
	res.render('story')
});

router.post('/story', function(req, res){
	console.log('adding story ' + req.body.title + ' to database');
	console.log('content: ' + req.body.story);

	var data = [
		req.body.title,
		req.body.story
	];

	var sql = 'INSERT INTO story (title, text) VALUES ($1, $2) RETURNING id';

	postgres.client.query(sql, data, function(err, result){
	console.log(data);

		var newStoryId = result.rows[0].id;
		var sql = 'SELECT * FROM story WHERE id = $1';
		postgres.client.query(sql, [newStoryId], function(err, result){
		if(err){
			res.statusCode = 500;
			return res.json({
				errors: ['Could not retrieve story after create']
			});
		}

		res.statusCode = 201;

		res.render('index', {title: 'Success!'});

		});
	});
});

module.exports = router;
