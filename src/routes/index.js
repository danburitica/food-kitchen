const { Router } = require("express");
const { manageRequests, getKitchen } = require("../controllers/index");
const router = Router();

router.get("/kitchen", manageRequests);
router.get("/info", getKitchen);

module.exports = router;
