'use strict';

const { Bme680 } = require('bme680-sensor');
const bme680 = new Bme680(1, 0x77);
const sqlite = require('sqlite');
var express = require('express');
var path = require('path');
var compression = require('compression');
var bmeCache = require('./bme-cache.service');


bme680.initialize().then(async () => {
  console.info('Sensor initialized');
  setInterval(async () => {
    const data = await bme680.getSensorData();
    const values = [Date.now() / 1000 | 0, process.uptime(), data.data.temperature, data.data.humidity, data.data.gas_resistance, data.data.heat_stable ? 1 : 0];
    console.info(values);
    bmeCache.write(values);
  }, 3000);
});

var indexRouter = require('./routes/index');
var conditionsRouter = require('./routes/conditions');

var app = express();

// app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/conditions', conditionsRouter);

module.exports = app;
