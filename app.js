// server.js - node.js
const http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var unique = require('array-unique');
var path = require('path'); // to work with files
var app = express();

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: true }));

// static files
app.use(express.static('public'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : ''
});

// Описываем объект типа Карта (базовый РСЯ объект без домена)
function yaCard(title, image, text){
  this.title = title;
  this.image = image;
  this.text = text;
}



//function t (callback) {
var domains = [];

connection.query('SELECT `id`,`name` FROM `rsya`.`domains`;', function(err, rows, fields) {

		if (err) throw err;
		for(var i=0; i<rows.length; i++)
		{
			var domain = {};
			domain.name = rows[i].name;
			domain.id = rows[i].id;
			domain.cards = [];
			var query = 'SELECT `title`,`image`,`text` FROM `rsya`.`cards` WHERE `domain-id`='+ rows[i].id +';';
			connection.query(query, function(err, rows, fields) {
				if (err) throw err;
				for(var i=0; i<rows.length; i++)
				{
					var card = new yaCard(rows[i].title, rows[i].image, rows[i].text);
					domain.cards.push(card); 
				}
			});
			domains[i] = domain;
		}
	
//	callback(domains);

});

//}
/*
t(function(domains){
	console.log(domains.length);

	for (var i = 0; i < domains.length; i++)
	{

		connection.query('SELECT `title`,`image`,`text` FROM `rsya`.`cards` WHERE `domain-id`='+ domains[i].id +';', function(err, rows, fields) {
		
			if (err) throw err;
			for(var j=0; j<rows.length; j++)
			{
				var card = {};
				card.title = rows[j].title;
				domains[i].cards.push(card);
			}
		});

	}

});
*/

app.get('/', function(req, res) {
    res.render('test.ejs', {'domains': domains});
});

app.listen(3000, '0.0.0.0');

/*

server.listen(80, '0.0.0.0');

*/

//console.log(titles);