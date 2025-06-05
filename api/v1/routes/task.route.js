const express = require('express');
const router = express.Router();

const controller = require('../controllers/task.controller');


router.get('/', controller.index);
router.get('/details/:id', controller.details);
router.patch('/change-status/:id', controller.changeStatus);

module.exports = router;