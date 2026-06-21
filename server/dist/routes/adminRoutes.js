"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_js_1 = require("../controllers/adminController.js");
const auth_js_1 = require("../middleware/auth.js");
const router = (0, express_1.Router)();
router.post('/login', adminController_js_1.loginAdmin);
router.post('/register', adminController_js_1.registerAdmin); // Can be secured or left open for initial seeding
router.get('/stats', auth_js_1.authenticateAdmin, adminController_js_1.getDashboardStats);
exports.default = router;
