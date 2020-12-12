

const express = require("express");
const router = express.Router();
const filter_controllers = require("../controllers/filter_controllers");

router.get("/filter_by_price",filter_controllers.filter_by_price);

router.get("/filter_by_activities",filter_controllers.filter_by_activities)

router.get("/filter_by_accommodations",filter_controllers.filter_by_accommodations)

router.get("/filter_by_amenities",filter_controllers.filter_by_amenities)

router.get("/filter_by_terran",)

module.exports = router;