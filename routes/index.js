var express = require('express');
var router = express.Router();
var pg = require('pg');

var postgres = require('../lib/postgres');
console.log(postgres);


/* GET home page. */
router.get('/', function(req, res) {

  var sql = 'SELECT * FROM story';
  postgres.client.query(sql, function(err, result){
  	if(err){
		res.statusCode = 500;
		return res.json({
			errors: ['Could not retrieve any stories from database']
		});
	}

	res.statusCode= 201;
	res.render('index', {title: 'TeensConnect', quote: '"Invisible threads are the strongest ties" -Anonymous'});

  });

});

router.get('/story', function(req, res){
	res.render('story')
});

router.post('/story', function(req, res){
	console.log('adding story ' + req.body.title + ' to database');
	console.log('content: ' + req.body.story);
	console.log('category: ' + req.body.category);

	var data = [
		req.body.title,
		req.body.story,
		req.body.category
	];

	var sql = 'INSERT INTO story (title, text, category) VALUES ($1, $2, $3) RETURNING id';

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

	  var sql = 'SELECT * FROM story';
	  postgres.client.query(sql, function(err, result){
	  	if(err){
			res.statusCode = 500;
			return res.json({
				errors: ['Could not retrieve any stories from database']
			});
		}

		res.statusCode = 201;
		res.render('index', {title: 'TeensConnect', quote: '"Invisible threads are the strongest ties" -Anonymous', stories : result.rows});



	  });

		});
	});
});


// retrieve stories by category
router.get('/:id', function(req, res){
	console.log('searching for category ' + req.params.id);

	var sql = "SELECT * FROM story WHERE category =  '" + req.params.id + "'";
	var data = req.params.id;
	var quote = "";

	switch(req.params.id){
		case "gender":
			quote = '"If Harry Potter taught us anything, it\'s that no one should live in a closet." -Anonymous';
			break;
		case "education":
			quote = '"Education is not preparation for life; education is life itself." -Anonymous';
			break;
		case "family":
			quote = '"Keep your heads up.  The universe gives its hardest battles to its strongest soldiers." -Anonymous';
			break;
	}

	postgres.client.query(sql, function(err, result){
		if(err){
			res.statusCode = 500;
			return res.json({
					errors: ['Could not retrieve category']
			});
		}

		if(result.rows){
			console.log('Results are ' + result.rows);
			res.statusCode = 201;
			res.render('index', {title: 'TeensConnect ', quote: quote, stories: result.rows});
		} else {
			res.render('story');
		}

		});

	});

module.exports = router;
