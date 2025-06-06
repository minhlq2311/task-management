const taskRoute = require('./task.route');
const userRoute = require('./user.route');
const authMiddleware = require('../../../middlewares/auth.middleware.js');
module.exports = (app) => {
    const version = '/api/v1';
    app.use(version + '/tasks', authMiddleware.requireAuth, taskRoute);
    app.use(version + '/users', userRoute);
};