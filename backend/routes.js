const router = require('express').Router();
const authController = require('./controllers/auth-controller')
const activateController = require('./controllers/activate-controller');
const authMiddleware = require('./middlewares/auth-middleware');

// We just reference to the function in controllers they will be called later by the router 
router.post('/api/send-otp', authController.senOtp);
router.post('/api/verify-otp', authController.verifyOtp);
router.post('/api/activate', authMiddleware, activateController.activate);

module.exports = router