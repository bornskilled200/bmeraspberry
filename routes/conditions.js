var express = require('express');
var router = express.Router();
var bmeCache = require('../bme-cache.service');

/* GET conditions listing. */
router.get('/', function(req, res, next) {
  let results = parseInt(req.query.results);
  if (isNaN(results)) {
    results = undefined;
  }
  bmeCache.read(results).then(array => {
    res.send(array);
	});
});

module.exports = router;
