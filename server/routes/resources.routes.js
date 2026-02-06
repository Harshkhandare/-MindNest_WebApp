const express = require('express');
const router = express.Router();
const resourcesController = require('../controllers/resources.controller');
// Resources are publicly accessible - no authentication required

router.get('/', resourcesController.getResources);
router.get('/categories', resourcesController.getCategories);
router.get('/:id', resourcesController.getResourceById);

module.exports = router;

