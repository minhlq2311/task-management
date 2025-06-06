const express = require('express');
const router = express.Router();
const validate = require('../../../validate/task_validate.js');
const controller = require('../controllers/task.controller');


router.get('/', controller.index);
router.get('/details/:id', controller.details);
router.patch('/change-status/:id', controller.changeStatus);
router.patch('/change-multi', controller.changeMulti);
router.post('/create', validate.createPost, controller.create);
module.exports = router;