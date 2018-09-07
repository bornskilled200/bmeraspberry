'use strict';

const { Bme680 } = require('bme680-sensor');
const bme680 = new Bme680(1, 0x77);

bme680.initialize().then(async () => {
    console.info('Sensor initialized');
    setInterval(async () => {
        console.info(await bme680.getSensorData());
    }, 3000);
});
