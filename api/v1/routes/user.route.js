const express = require('express');
const router = express.Router();
const validate = require('../../../validate/user_validate.js');
const controller = require('../controllers/user.controller');
const authMiddleware = require('../../../middlewares/auth.middleware.js');

router.post('/register', validate.registerPost, controller.register);
router.post('/login', validate.loginPost, controller.login);
router.post('/password/forgot', validate.forgotPasswordPost, controller.forgotPassword);
router.post('/password/otp', validate.forgotPasswordPost, controller.otpPassword);
router.post('/password/reset', validate.resetPasswordPost, controller.resetPasswordPost);
router.get('/list', authMiddleware.requireAuth, controller.list);

router.get('/detail', authMiddleware.requireAuth, controller.userDetail);
module.exports = router;