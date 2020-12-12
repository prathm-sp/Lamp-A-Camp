const Bookings = require("../models/booking");
const Camps = require("../models/camps");
const CampOwner = require("../models/camp_owner");
const Camper = require("../models/camper");
const e = require("express");

exports.create_a_booking = async (req, res) => {
  try {
    const camp_user = req.profile;
    const a_details = req.body.a_details;
    var total = 0;
    for (let i = 0; i < a_details.length - 1; i++) {
      total += a_details[i].totalPrice;
    }
    camper_details = camp_user._id;
    total_amount = total;
    const camp_found = await Camps.findOne({ camp_name: req.body.c_name });
    const c_owner = await CampOwner.findOne({ _id: camp_found.camp_owner });
    if (!camp_found) {
      throw new Error("No Camp");
    }
    camp = camp_found._id;
    const created_booking = await new Bookings({
      a_details,
      camper_details,
      total_amount,
      camp,
    });
    if (!created_booking) {
      throw new Error("Error In Creation");
    } else {
      await created_booking.save();
      camp_user.bookings_made.push(created_booking);
      await camp_user.save();
      c_owner.camp_booking.push(created_booking._id);
      await c_owner.save();
      res.status(201).send(created_booking);
    }
  } catch (error) {
    if (error.message == "No Camp") {
      res.status(404).send("No Camp Found");
    } else if (error.message == "Error In Creation") {
      res.status(400).send("Something Went Wrong");
    }
    res.send(error.message);
  }
};

exports.accept_a_booking = async (req, res) => {
  console.log(req.headers.booking_id);
  try {
    const booking = await Bookings.findOne({ _id: req.headers.booking_id });
    if (!booking) {
      throw new Error("No Booking ID Found");
    }
    if (booking.status == "Pending For Confirmation") {
      booking.status = "Confirmed and Pending For Payment";
      booking.save();
      res.send("Booking Confirmed Check Pending Payments Tab");
    } else {
      throw new Error("Booking Already Confirmed");
    }
  } catch (error) {
    if (error.message == "Booking Already Confirmed") {
      res.status(400).send("Already Confirmed Booking");
    } else if (error.message == "No Booking ID Found") {
      res.status(404).send("No Booking Found");
    } else {
      res.status(400).send(error.message);
    }
  }
};

exports.reject_a_booking = async (req, res) => {
  try {
    const booking = await Bookings.findOne({ _id: req.headers.booking_id });
    if (!booking) {
      throw new Error("No Booking ID Found");
    }
    if (booking.status == "Pending For Confirmation") {
      booking.status = "Rejected By Owner";
      booking.save();
      res.send(
        "Sorry For Inconvinienvce ! Booking Has Been Rejected By The Owner Due To Some Reasons Try Contacting The Camp Manager Or Owner"
      );
    } else {
      throw new Error("Booking Already Rejected");
    }
  } catch (error) {
    if (error.message == "Booking Already Rejected") {
      res.status(400).send("Already Rejected Booking");
    } else if (error.message == "No Booking ID Found") {
      res.status(404).send("No Booking Found");
    } else {
      res.status(400).send(error.message);
    }
  }
};

// camper
exports.get_all_pending_bookings = async (req, res) => {
  try {
    const user = req.profile;
    if (!user) {
      throw new Error("No User Found");
    }
    const bookings = await Camper.findOne({ _id: user._id }).populate({
      path: "bookings_made",
      match: { status: "Pending For Confirmation" },
    });
    if (bookings.bookings_made.length < 1) {
      throw new Error("No Pending Bookings");
    }
    // console.log(bookings.bookings_made)
    res.send(bookings);
  } catch (error) {
    if (error.message == "No User Found") {
      res.status(404).send(error.message);
    } else if (error.message == "No Pending Bookings") {
      res.status(404).send("No Bookings Found");
    } else {
      res.status(400).send(error.message);
    }
  }
};

exports.get_all_accepted_bookings = async (req, res) => {
  try {
    const user = req.profile;
    if (!user) {
      throw new Error("No User Found");
    }
    const bookings = await Camper.findOne({ _id: user._id }).populate({
      path: "bookings_made",
      match: { status: "Confirmed and Pending For Payment" },
    });
    if (bookings.bookings_made.length < 1) {
      throw new Error("No Accepted Bookings");
    }
    // console.log(bookings.bookings_made)
    res.send(bookings);
  } catch (error) {
    if (error.message == "No User Found") {
      res.status(404).send(error.message);
    } else if (error.message == "No Accepted Bookings") {
      res.status(404).send("No Bookings Found");
    } else {
      res.status(400).send(error.message);
    }
  }
};

exports.get_all_accepted_bookings_owner = async (req, res) => {
  try {
    const user = req.profile;
    if (!user) {
      throw new Error("No User Found");
    }
    const bookings = await CampOwner.findOne({ _id: user._id }).populate({
      path: "camp_booking",
      match: { status: "Confirmed and Pending For Payment" },
    });
    if (bookings.camp_booking.length < 1) {
      throw new Error("No Accepted Bookings");
    }
    // console.log(bookings.bookings_made)
    res.send(bookings);
  } catch (error) {
    if (error.message == "No User Found") {
      res.status(404).send(error.message);
    } else if (error.message == "No Accepted Bookings") {
      res.status(404).send("No Bookings Found");
    } else {
      res.status(400).send(error.message);
    }
  }
};

exports.get_all_rejected_bookings = async (req, res) => {
  try {
    const user = req.profile;

    if (!user) {
      throw new Error("No User Found");
    }
    const bookings = await Camper.findOne({ _id: user._id }).populate({
      path: "bookings_made",
      match: { status: "Rejected By Owner" },
    });
    console.log(bookings);
    if (bookings.bookings_made.length < 1) {
      throw new Error("No Rejected Bookings");
    }
    // console.log(bookings.bookings_made)
    res.send(bookings);
  } catch (error) {
    if (error.message == "No User Found") {
      res.status(404).send(error.message);
    } else if (error.message == "No Rejected Bookings") {
      res.status(404).send("No Bookings Found");
    } else {
      res.status(400).send(error.message);
    }
  }
};

exports.get_all_approved_bookings = async (req, res) => {
  console.log(req.body);
  try {
    const user = req.profile;
    if (!user) {
      throw new Error("No User Found");
    }
    const bookings = await Camper.findOne({ _id: user._id }).populate({
      path: "bookings_made",
      match: { status: "Approved" },
    });
    if (bookings.bookings_made.length < 1) {
      throw new Error("No Accepted Bookings");
    }
    // console.log(bookings.bookings_made)
    res.send(bookings);
  } catch (error) {
    if (error.message == "No User Found") {
      res.status(404).send(error.message);
    } else if (error.message == "No Accepted Bookings") {
      res.status(404).send("No Bookings Found");
    } else {
      res.status(400).send(error.message);
    }
  }
};
