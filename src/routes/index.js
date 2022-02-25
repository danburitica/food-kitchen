const { Router } = require("express");
const { manageRequests } = require("../controllers/index");
const router = Router();

router.get("/kitchen", manageRequests);

module.exports = router;
