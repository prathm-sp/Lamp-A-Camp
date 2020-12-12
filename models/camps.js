const mongoose = require("mongoose");
const Camp_Owner = require("../models/camp_owner");

const campSchema = new mongoose.Schema(
  {
    camp_name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    interesting_name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    describe_in_255chars: {
      type: String,
      trim: true,
    },
    camp_desc: {
      type: String,
      required: true,
      trim: true,
      minlength: 50,
    },
    camp_state: {
      type: String,
      required: true,
      trim: true,
    },
    camp_location: {
      type: String,
      // required: true,
      trim: true,
    },
    tags: {
      type: String,
      // required: true,
      trim: true,
    },
    land_type: {
      type: String,
      required: true,
      trim: true,
    },
    accessibility_by: {
      type: String,
      required: true,
      trim: true,
    },
    activities: {
      type: Array,
      required: true,
      default: [],
    },
    animities: {
      type: Array,
      required: true,
      default: [],
    },
    accomodations: {
      type: Object,
    },
    camp_owner: {
      type: Array,
      ref: "Camp_Owner",
    },
    camp_images: {
      type: Array,
      default: [],
      // required:true
    },
    manager_name: {
      type: String,
      trim: true,
      required: true,
    },
    manager_contact: {
      type: String,
      trim: true,
      required: true,
    },
    manager_email: {
      type: String,
      trim: true,
      required: true,
    },
    manager_phone: {
      type: String,
      trim: true,
      required: true,
    },
    check_in: {
      type: String,
      trim: true,
      required: true,
    },
    check_out: {
      type: String,
      trim: true,
      required: true,
    },
    cancellation_policy: {
      type: String,
      trim: true,
      required: true,
    },
    status_of_camp: {
      type: String,
      trim: true,
      default: "Pending",
    },
    state_of_camp: {
      type: String,
      trim: true,
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Camps = mongoose.model("Camps", campSchema);
module.exports = Camps;
