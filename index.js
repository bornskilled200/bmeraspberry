'use strict';

const { Bme680 } = require('bme680-sensor');
const bme680 = new Bme680(1, 0x77);
const { Pool } = require('pg');

const pool = new Pool({
	user: 'bmewriter',
	password: 'password',
});
bme680.initialize().then(async () => {
    console.info('Sensor initialized');
    setInterval(async () => {
    	const data = await bme680.getSensorData();
        console.info(data);
		const q = 'INSERT INTO conditions(time, location, temperature, humidity, air) values($1, $2, $3, $4, $5)'
		const values = ['now()', 'room', data.data.temperature, data.data.humidity, data.data.gas_resistance];
		const { rows } = await db.query(q, values);
        // INSERT INTO conditions(time, location, temperature, humidity) VALUES (NOW(), 'office', 70.0, 50.0);
    }, 3000);
});
