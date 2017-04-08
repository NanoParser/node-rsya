// server.js - node.js
const http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var unique = require('array-unique');
var path = require('path'); // to work with files
const winston = require('winston');

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
  password : '',
  database: 'rsya'
});

function getDomains()
{
    return new Promise(function(resolve, reject) {
        // The Promise constructor should catch any errors thrown on
        // this tick. Alternately, try/catch and reject(err) on catch.

        var query_str =
            "SELECT name FROM domains";

        connection.query(query_str, function (err, rows, fields) {
            // Call reject on error states,
            // call resolve with results
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

getDomains()
    .then(rows => {
        let collection = {

        };
//        winston.log('info', rows);
        for(var i = 0; i<rows.length; i++){
            collection.domains.push(rows[i].name);
        }
//        winston.log('info', collection);
        return collection;
    });

app.get('/', function(req, res) {
    res.render('test.ejs', {'domains': domains});
});

app.listen(3000, '0.0.0.0');