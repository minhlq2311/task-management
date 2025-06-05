const express = require('express');
const router = express.Router();

const controller = require('../controllers/task.controller');


router.get('/all', controller.index);
router.get('/details/:id', controller.details);

module.exports = router;