const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const csv = require('csvtojson');

app.use(express.static('public'));

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/data', function (req, res) {
	const csvFilePath='schools_detailed_overview.csv';
	csv()
		.fromFile(csvFilePath)
		.then((jsonObj)=>{
			console.log(jsonObj);
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(jsonObj));
		});
});

app.listen(3000, function () {
  console.log('Viz running on port 3000');
});
