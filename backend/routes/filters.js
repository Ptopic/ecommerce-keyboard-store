const {
	generateFilters,
	regenerateFilters,
} = require('../controllers/filters');

const router = require('express').Router();

router.get('/generate/:categoryName', generateFilters);
router.get('/regenerate/:categoryName', regenerateFilters);

module.exports = router;
