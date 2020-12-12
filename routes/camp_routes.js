const express = require("express");
const router = express.Router();
const camp_controller = require("../controllers/camp_controllers");

router.post("/accept_camp", camp_controller.accept_a_camp);

router.get("/get_all_camps", camp_controller.get_all_camps);

router.post("/reject_camp", camp_controller.reject_a_camp);

router.get("/get_accepted_camps", camp_controller.get_accepted_camps);

router.get("/get_rejected_camps", camp_controller.get_rejected_camps);

router.get("/get_pending_camps", camp_controller.get_pending_camps);

module.exports = router;
