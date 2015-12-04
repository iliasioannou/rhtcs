var express = require('express');
var app     = express();

app.use(express.static(__dirname + '/'));

app.get('/', function(req, res) {
    res.sendfile('./index.html');
});

app.listen(8080);
console.log('Magic happens on 8080');
