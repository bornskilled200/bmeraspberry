'use strict';
const isPi = process.platform === 'linux'; // VERY NAIVE CHECK

if (isPi) {
  const { Bme680 } = require('bme680-sensor');
  const bme680 = new Bme680(1, 0x77);
  const bmeCache = require('./bme-cache.service');

  bme680.initialize().then(async () => {
    console.info('Sensor initialized');
    setInterval(async () => {
      const data = await bme680.getSensorData();
      const values = [Date.now() / 1000 | 0, process.uptime(), data.data.temperature, data.data.humidity, data.data.gas_resistance, data.data.heat_stable ? 1 : 0];
      console.info(values);
      bmeCache.write(values);
    }, 3000);
  });
}


const express = require('express');
const condition = require('condition');
const compression = require('compression');

const indexRouter = require('./routes/index');
const conditionsRouter = require('./routes/conditions');

const app = express();

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(condition.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/conditions', conditionsRouter);

module.exports = app;
