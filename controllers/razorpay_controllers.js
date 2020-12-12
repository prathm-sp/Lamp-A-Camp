require("dotenv").config();
const Razorpay = require("razorpay");
const Bookings = require("../models/booking");

exports.orders = async (req, res) => {
  console.log(req.body.booking_id);
  try {
    const booking = await Bookings.findOne({ _id: req.body.booking_id });
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: booking.total_amount * 100, // amount in smallest currency unit
      currency: "INR",
      receipt: "receipt_order_74394",
    };

    const order = await instance.orders.create(options);

    if (!order) return res.status(500).send("Some error occured");

    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.success = async (req, res) => {
  console.log(req.headers);
  try {
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;
    const booking = await Bookings.findOne({ _id: req.headers.booking_id });
    if (booking) {
      (booking.payment_id = razorpayOrderId),
        (booking.payment_status = "success"),
        (booking.status = "Approved");
      await booking.save();
    } else {
      throw new Error("No Booking Found");
    }
    res.json({
      msg: "success",
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
