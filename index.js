'use strict';
const isPi = process.platform === 'linux'; // VERY NAIVE CHECK
const { promisify } = require('util');

if (isPi) {
  const bmeCache = require('./bme-cache.service');
  const execFile = util.promisify(require('child_process').execFile);

  async function getAir() {
    await execFile('/usr/local/lib/airpi/pms5003');
    const { stdout } = await execFile('/usr/local/lib/airpi/pms5003', ['pm2.5']);
    return Number(stdout);
  }
  console.info('Sensor initialized');
  setInterval(async () => {
    const values = [Date.now() / 1000 | 0, process.uptime(), await getAir()];
    console.info(values);
    bmeCache.write(values);
  }, 1000 * 15);
}


const express = require('express');
const path = require('path');
const compression = require('compression');

const indexRouter = require('./routes/index');
const conditionsRouter = require('./routes/conditions');

const app = express();

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/conditions', conditionsRouter);

module.exports = app;
