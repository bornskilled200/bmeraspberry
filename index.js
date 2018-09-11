'use strict';

const { Bme680 } = require('bme680-sensor');
const bme680 = new Bme680(1, 0x77);
const sqlite = require('sqlite');
var express = require('express');
var path = require('path');

sqlite.open('./bme.db').then(async db => {
await db.run(`CREATE TABLE IF NOT EXISTS conditions (
  time        INTEGER NOT NULL,
  uptime      INTEGER NOT NULL,
  temperature REAL    NOT NULL,
  humidity    REAL    NOT NULL,
  air         REAL    NOT NULL,
  stable      INTEGER NOT NULL
);`);

const q = await db.prepare('INSERT INTO conditions(time, uptime, temperature, humidity, air, stable) values(strftime(\'%s\',\'now\'), ?, ?, ?, ?, ?)');
	bme680.initialize().then(async () => {
	    console.info('Sensor initialized');
	    setInterval(async () => {
	    	const data = await bme680.getSensorData();
			const values = [process.uptime(), data.data.temperature, data.data.humidity, data.data.gas_resistance, data.data.heat_stable ? 1 : 0];
	        console.info(values);
			q.run(values);
	        // INSERT INTO conditions(time, location, temperature, humidity) VALUES (NOW(), 'office', 70.0, 50.0);
	    }, 3000);
	});
});


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;