var express = require('express');
var router = express.Router();
const sqlite = require('sqlite');



/* GET users listing. */
router.get('/', function(req, res, next) {
	sqlite.open('./bme.db', { cached: true, mode: sqlite.OPEN_READONLY }).then(async db => {
		return db.all('SELECT * FROM conditions ORDER BY time DESC limit 600');
	}).then(conditions => {
		res.send((conditions));
    	res.flush();
	});
});

module.exports = router;
