const express = require("express");
const router = express.Router();
const admin_controllers = require("../controllers/admin_controllers");
const auth = require("../middleware/admin_auth");
const dual = require("../middleware/admin_2fa");
const camp_controller = require("../controllers/camp_controllers");

router.post("/signup", admin_controllers.signup);

router.post("/login", dual.admin_2fa);

router.post("/verify", dual.admin_2fa_verify, admin_controllers.login);

router.post("/resend_otp", dual.admin_2fa_resendOTP);

router.get("/auth", auth, admin_controllers.auth);

router.put("/updateuser", auth, admin_controllers.update);

router.put("/updatepassword", auth, admin_controllers.updatePassword);

router.delete("/delete_camp_owner", auth, admin_controllers.delete_camp_owner);

router.get("/getallcampowners", admin_controllers.getallcamp_owners);

router.get("/get_all_camps", camp_controller.get_all_camps);

router.post("/accept_camp", camp_controller.accept_a_camp);

router.post("/reject_camp", camp_controller.reject_a_camp);

router.get("/get_accepted_camps", camp_controller.get_accepted_camps);

router.get("/get_rejected_camps", camp_controller.get_rejected_camps);

router.get("/get_pending_camps", camp_controller.get_pending_camps);

router.get("/get_active_camps", camp_controller.get_active_camps);

router.get("/inActiveCamps", camp_controller.get_inactive_camps);

router.post("/inActive_a_camp", camp_controller.mark_inactive_a_camp);

module.exports = router;
