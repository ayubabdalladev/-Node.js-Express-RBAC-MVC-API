const router = require("express").Router();
const userController = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

// ✅ any logged in user
router.get("/profile", protect, userController.profile);

// ✅ admin only
router.get("/admin", protect, allowRoles("admin"), userController.adminDashboard);

module.exports = router;
