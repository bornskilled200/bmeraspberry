var express = require('express');
var router = express.Router();
const sqlite = require('sqlite');
var bmeCache = require('../bme-cache.service');



/* GET users listing. */
router.get('/', function(req, res, next) {
  bmeCache.read().then(array => {
    res.send(array);
	});
});

module.exports = router;
