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
 //           winston.log('info', rows);
            resolve(rows);
        });
    });
}

function getCards(domain)
{
    return new Promise(function(resolve, reject) {
        // The Promise constructor should catch any errors thrown on
        // this tick. Alternately, try/catch and reject(err) on catch.

//        winston.log('info', domain);

        var query_str =
            "SELECT title, image, text FROM cards WHERE `domain-id` =" +
            " (SELECT id FROM domains WHERE `name`='" + domain + "')";

 //       winston.log('info', query_str);

        connection.query(query_str, function (err, rows, fields) {
            // Call reject on error states,
            // call resolve with results
            if (err) {
                return reject(err);
            }
//            winston.log('info', rows);
            resolve(rows);
        });
    });
}

getDomains()
    .then(rows => {
        var domains = [];
        for(var i = 0; i<rows.length; i++){
            let domain = {name:undefined, cards:[]};
            domain.name = rows[i].name;
            domains[i] = domain;
        }
 //       winston.log('info', 'domains', domains);
        return domains;
    })
    .then(domains => {
        for(var i = 0; i<domains.length; i++)
        {
            domains[i].cards.push(
                getCards(domains[i].name)
                .then(
                    rows => {
                                let collection = [];
                                for(var j = 0; j<rows.length; j++){
                                    let card = {title:undefined, image:undefined, text:undefined};
                                    card.title = rows[j].title;
                                    card.image = rows[j].image;
                                    card.text = rows[j].text;
                                    collection[j] = card;
                                }
                               return collection;
                            }
                )
        );
        winston.log('info', domains);
        }
        //winston.log('info', domains);
        return domains;
});

app.get('/', function(req, res) {
    res.render('test.ejs', {'domains': domains});
});

app.listen(3000, '0.0.0.0');