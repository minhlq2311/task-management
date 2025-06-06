const express = require('express');
const router = express.Router();
const validate = require('../../../validate/user_validate.js');
const controller = require('../controllers/user.controller');


router.post('/register', validate.registerPost, controller.register);
router.post('/login', validate.loginPost, controller.login);
router.post('/password/forgot', validate.forgotPasswordPost, controller.forgotPassword);
router.post('/password/otp', validate.forgotPasswordPost, controller.otpPassword);
router.post('/password/reset', validate.resetPasswordPost, controller.resetPasswordPost);

module.exports = router;