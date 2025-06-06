const express = require('express');
const router = express.Router();
const validate = require('../../../validate/user_validate.js');
const controller = require('../controllers/user.controller');


router.post('/register', validate.registerPost, controller.register);
// router.post('/register', validate.registerPost, controller.registerPost);
// router.post('/login', validate.loginPost, controller.loginPost);
// router.post('/forgot-password', validate.forgotPasswordPost, controller.forgotPasswordPost);
// router.post('/reset-password', validate.resetPasswordPost, controller.resetPasswordPost);

module.exports = router;