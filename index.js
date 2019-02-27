'use strict';
const isPi = process.platform === 'linux'; // VERY NAIVE CHECK
const { promisify } = require('util');

if (isPi) {
  const bmeCache = require('./bme-cache.service');
  const execFile = promisify(require('child_process').execFile);

  async function getAir() {
    await execFile('/usr/local/lib/airpi/pms5003');
    const { stdout } = await execFile('/usr/local/lib/airpi/pms5003-snmp', ['pm2.5']);
    return stdout && Number(stdout);
  }
  console.info('Sensor initialized');
  const loop = async () => {
    const air = await getAir();
    if (air === false) {
      console.info('ignoring empty stdout', air);
      return;
    }
    const values = [Date.now() / 1000 | 0, process.uptime(), air];
    console.info(values);
    bmeCache.write(values);
  }
  loop();
  setInterval(loop, 1000 * 60 * 5);
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
