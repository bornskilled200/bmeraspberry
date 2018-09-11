var express = require('express');
var router = express.Router();
const sqlite = require('sqlite');



/* GET users listing. */
router.get('/', function(req, res, next) {
	sqlite.open('./bme.db', { cached: true }).then(async db => {
		return db.get('SELECT * FROM conditions ORDER BY time limit 400');
	}).then(conditions => {
		res.send(JSON.stringify(conditions));
	});
});

module.exports = router;
