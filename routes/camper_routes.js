const express = require("express");
const router = express.Router();
const camper_controller = require("../controllers/camper_controllers");
const camp_controller = require("../controllers/camp_controllers");
const auth = require("../middleware/authorization");
const booking_controller = require("../controllers/booking_controllers");

router.post("/signup", camper_controller.signup);

router.post("/login", camper_controller.login);

router.get("/auth", auth, camper_controller.auth);

router.put("/update_profile", auth, camper_controller.update);

router.put("/update_password", auth, camper_controller.updatePassword);

router.delete("/delete_user", auth, camper_controller.delete_user);

router.get("/getuser", auth, camper_controller.find_specific_user);

router.get("/get_a_camp", camper_controller.get_a_camp);

router.get("/get_recent_camps", camp_controller.get_recent_camps);

router.get("/get_trending_camps", camp_controller.get_trending_camps);

router.get(
  "/get_all_pending_bookings",
  auth,
  booking_controller.get_all_pending_bookings
);

router.get(
  "/get_all_accepted_bookings",
  auth,
  booking_controller.get_all_accepted_bookings
);

router.get(
  "/get_all_rejected_bookings",
  auth,
  booking_controller.get_all_rejected_bookings
);

router.get(
  "/pending_for_payment",
  auth,
  camper_controller.get_pending_for_payment
);

router.get("/approved", auth, camper_controller.get_payament_success);

router.get("/add_to_wishlist", auth, camper_controller.add_to_wishlist);

router.get(
  "/get_wishlist",
  auth,
  camper_controller.get_all_camps_from_wishlist
);

module.exports = router;
