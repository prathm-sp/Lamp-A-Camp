const Camp_Owner = require("../models/camp_owner");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validate = require("validator");
const Camps = require("../models/camps");
const imgbbUploader = require("imgbb-uploader");
const fs = require("fs");
const e = require("express");
const Booking = require("../models/booking");

exports.signup = async (req, res) => {
  try {
    const pass = req.body.password;
    if (pass.length < 7) {
      throw new Error("Password Invalid");
    }
    const newUser = await new Camp_Owner(req.body);
    const gentoken = await newUser.genAuthToken();
    console.log("gentoken", gentoken);
    await newUser.save();
    res.status(201).json({
      message: "User Created",
      user: newUser,
      token: gentoken,
    });
  } catch (error) {
    console.log(error);
    const msg = error.message;
    const msg_splitted = msg.split(" ");
    console.log("Conflict", msg_splitted[11]);
    if (msg_splitted[11] == "mobile:") {
      res
        .status(409)
        .send("Mobile Number Already Exist Please Try New Credentials");
    } else if (msg_splitted[11] == "email:") {
      res.status(409).send("Email Already Exist Please Try New Credentials");
    } else if (error.message == "Password Invalid") {
      res.status(409).send("Password Length Must Be Atleast 7 Characters");
    } else {
      res.status(409).send(error.message);
    }
  }
};

exports.login = async (req, res) => {
  try {
    let eMail = req.body.email;
    let passWord = req.body.password;
    const user = await Camp_Owner.findByCredentials(eMail, passWord);
    if (!user) {
      throw new Error("No User Found");
    }
    const token = await user.genAuthToken();
    res.status(200).json({
      Message: "Login Successfully",
      token,
      user: user,
    });
  } catch (error) {
    if (error.message == "No User Found") {
      res.status(404).send(error.message + " With Given Credentials");
    }
  }
};

exports.auth = async (req, res) => {
  res.send(req.profile);
};

exports.update = async (req, res) => {
  try {
    const user = req.profile;
    if (user) {
      const email = req.body.email;
      if (email) {
        if (!validate.isEmail(email)) {
          throw new Error("Invalid Email");
        }
      }
      const phone = req.body.mobile;
      if (phone) {
        if (!validate.isMobilePhone(phone, "en-IN")) {
          throw new Error("Invalid Mobile Number");
        }
      }
      const mobile_already = await Camp_Owner.find({
        mobile: req.body.mobile,
      });
      if (mobile_already[0]) {
        console.log(
          "-------------------------------------------------------",
          mobile_already
        );
        throw new Error("Mobile Number Already Exist");
      }
      const email_already = await Camp_Owner.find({
        email: req.body.email,
      });
      {
        if (email_already[0]) {
          console.log(
            "-------------------------------------------------------",
            email_already
          );
          throw new Error("Email Already Exist");
        }
      }
      console.log("FrOM UPDATE", user);
      const u = await Camp_Owner.findById({
        _id: user._id,
      }); //finding and updating
      console.log(u);
      await u.updateOne(req.body, {
        runValidators: true,
      });
      await u.save();

      const updated = await Camp_Owner.findById({
        _id: user.id,
      }); //finding Updated User
      const token = await updated.genAuthToken();
      res.json({
        updated,
        token,
      });
    } else {
      throw new Error("No User Found");
    }
  } catch (error) {
    if (error.message == "Invalid Mobile Number") {
      res.status(409).send(error.message);
    } else if (error.message == "Invalid Emai") {
      res.status(409).send(error.message);
    } else if (error.message == "Mobile Number Already Exist") {
      res.status(409).send("Mobile Number Already Exist Try Other To Update");
    } else if (error.message == "Email Already Exist") {
      res.status(409).send("Email Already Exist Try Other To Update");
    }
    console.log(error);
    res.send(error.message);
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const user = req.profile;
    const pass = req.body.password;
    if (pass.length < 7) {
      throw new Error("Password Invalid");
    }
    if (user) {
      const newPassword = req.body.password;
      console.log(user.password);
      const u = await Camp_Owner.findOneAndUpdate(
        {
          _id: user._id,
        },
        req.body
      ); //finding and updating
      const updated = await Camp_Owner.findById({
        _id: user.id,
      }); //finding Updated User
      await updated.save();
      res.send(updated);
    } else {
      throw new Error("No user found");
    }
  } catch (error) {
    if ((error.message = "No User Found")) {
      res.status(404).send(error.message);
    } else if (error.message == "Password Invalid") {
      res.status(409).send("Password Length Must Be Atleast 7 Characters");
    } else {
      res.status(500).send(error.message);
    }
  }
};

exports.delete_user = async (req, res) => {
  try {
    const user = req.profile;
    if (user) {
      const del_user = await Camp_Owner.findByIdAndRemove({
        _id: user._id,
      });
      console.log(del_user);
      res.json({
        message: "user deleted",
      });
    } else {
      res.send("No User Found");
    }
  } catch (error) {
    if ((error.message = "No User To Delete")) {
      res.status(404).send(error.message);
    }
  }
};

exports.find_specific_user = async function (req, res) {
  try {
    const user = req.profile;
    if (user) {
      res.send(user);
    } else {
      res.send({
        message: "user not exits",
      });
      throw new Error("No User Found");
    }
  } catch (error) {
    if ((error.message = "No User Found")) {
      res.status(404).send(error.message);
    }
  }
};

exports.create_a_camp = async (req, res) => {
  try {
    const status_of_camp = "Incomplete";
    const camp_o = req.profile;
    const interesting_name = req.body.campDetails.interestingName;
    const camp_name = req.body.campDetails.originalName;
    const describe_in_255chars = req.body.describe_in_255chars;
    const camp_desc = req.body.campDetails.campDescription;
    const camp_state = req.body.campDetails.state;
    const camp_location = req.body.campDetails.location;
    const accessibility_by = req.body.campDetails.accessibleBy;
    const land_type = req.body.campDetails.landType;
    const activities = req.body.campActivities;
    const accomodations = req.body.campAccomodation;
    const animities = req.body.campAmenities;
    const manager_name = req.body.campOwner.managerName;
    const manager_contact = req.body.campOwner.managerNumber;
    const manager_email = req.body.campOwner.managerEmail;
    const manager_phone = req.body.campOwner.managerLandline;
    const check_in = req.body.campExtraDetails.checkInTime;
    const check_out = req.body.campExtraDetails.checkOutTime;
    const cancellation_policy = req.body.campExtraDetails.policy;
    console.log(Object.keys(req.body.campAccomodation).length);
    console.log(req.body.campActivities);
    if (!camp_o) {
      throw new Error("No User Found");
    }
    const camp_owner = camp_o._id;
    const camp = await new Camps({
      interesting_name,
      camp_name,
      camp_desc,
      camp_state,
      camp_location,
      describe_in_255chars,
      accessibility_by,
      land_type,
      activities,
      accomodations,
      animities,
      manager_name,
      camp_owner,
      manager_contact,
      manager_email,
      manager_phone,
      check_in,
      check_out,
      cancellation_policy,
      status_of_camp,
    });
    await camp.save();
    camp_o.campsListed.push(camp._id);
    await camp_o.save();
    res.status(201).json({
      message: "Camp Created",
      camp,
    });
  } catch (error) {
    const splitted_error = error.message.split(" ");
    console.log(splitted_error);
    if (error.message == "No User Found") {
      res.status(404).send("No Owner Found");
    } else if (
      splitted_error[1] == "duplicate" &&
      splitted_error[11] == "camp_name:"
    ) {
      res.status(409).send("Camp Name Already Used");
    } else if (
      splitted_error[1] == "duplicate" &&
      splitted_error[11] == "interesting_name:"
    ) {
      res.status(409).send("Interesting Name Already Used");
    } else if (splitted_error[3] == "camp_desc:") {
      res.status(409).send("Description Must Be Atleast 50 Characters");
    } else {
      res.status(409).send(error.message);
    }
  }
};

exports.upload_image = async (req, res) => {
  console.log(req.files);
  // res.send("All Files");
  // console.log(path)
  console.log(req.headers.camp_name);
  for (let i = 0; i < req.files.length; i++) {
    try {
      // const c_name = req.body.camp_name;
      // const camp = await Camps.findOne({camp_name:c_name});
      const camp = await Camps.findOne({
        camp_name: req.headers.camp_name,
      });
      // console.log(camp);
      if (!camp) {
        throw new Error("null");
      }
      const path = req.files[i].path;
      console.log(path);
      const result = await imgbbUploader(process.env.IMGBB_API_KEY, path);
      console.log(result);
      for (let i = 0; i < camp.camp_images.length; i++) {
        if (camp.camp_images[i] == result.url) {
          throw new Error("Image Already Uploaded Try Another Image");
        }
      }
      camp.camp_images.push(result.url);
      await camp.save();
      fs.unlink(path, (error) => {
        if (error) {
          console.error(err.message);
          res.send(err.message);
        } else {
          console.log("deleted ", path);
          if (i == req.files.length - 1) {
            camp.status_of_camp = "complete";
            camp.save();
          }
        }
      });
      if (i == req.files.length - 1) {
        res.send("uploaded");
      }
    } catch (error) {
      const path = req.files[i].path;
      if (error.message == "Image Already Uploaded Try Another Image") {
        fs.unlink(path, (error) => {
          if (error) {
            console.error(err.message);
            res.send(err.message);
          }
        });
        res.status(409).send("Image Already Uploaded Try Another Image");
      } else if (error.message == "null") {
        fs.unlink(path, (error) => {
          if (error) {
            console.error(err.message);
            res.send(err.message);
          }
        });
        res.status(404).send("Camp Not Found");
      } else {
        res.send(error.message);
      }
    }
  }
};
// exports.upload_image = async (req, res) => {
//   console.log(req.files);
//   // res.send("All Files");
//   // console.log(path)
//   console.log(req.headers.camp_name);
//   for (let i = 0; i < req.files.length; i++) {
//     try {
//       // const c_name = req.body.camp_name;
//       // const camp = await Camps.findOne({camp_name:c_name});
//       const camp = await Camps.findOne({
//         camp_name: req.headers.camp_name,
//       });
//       // console.log(camp);
//       if (!camp) {
//         throw new Error("null");
//       }
//       const path = req.files[i].path;
//       console.log(path);
//       const result = await imgbbUploader(process.env.IMGBB_API_KEY, path);
//       console.log(result);
//       for (let i = 0; i < camp.camp_images.length; i++) {
//         if (camp.camp_images[i] == result.url) {
//           throw new Error("Image Already Uploaded Try Another Image");
//         }
//       }
//       camp.camp_images.push(result.url);
//       fs.unlink(path, (error) => {
//         if (error) {
//           console.error(err.message);
//           res.send(err.message);
//         } else {
//           console.log("deleted ", path);
//           if (i == camp.camp_images.length) {
//             camp.status_of_camp = "complete";
//             camp.save();
//           }
//         }
//       });
//     } catch (error) {
//       const path = req.files[i].path;
//       if (error.message == "Image Already Uploaded Try Another Image") {
//         fs.unlink(path, (error) => {
//           if (error) {
//             console.error(err.message);
//             res.send(err.message);
//           }
//         });
//         res.status(409).send("Image Already Uploaded Try Another Image");
//       } else if (error.message == "null") {
//         fs.unlink(path, (error) => {
//           if (error) {
//             console.error(err.message);
//             res.send(err.message);
//           }
//         });
//         res.status(404).send("Camp Not Found");
//       } else {
//         res.send(error.message);
//       }
//     }
//   }
//   res.send("upload");
// };

exports.get_pending_camps = async (req, res) => {
  try {
    const user = req.profile;
    if (user) {
      const bookings = await Camp_Owner.findOne({
        _id: user._id,
      }).populate({
        path: "camp_booking",
        match: {
          status: "Pending For Confirmation",
        },
      });

      console.log(bookings);
      res.send(bookings);
    } else {
      throw new Error("No User Found");
    }
  } catch (error) {
    if (error.message == "No User Found") {
      res.status(404).send("No user found");
    } else {
      res.status(404).send(error);
    }
  }
};

exports.get_pending_for_payment = async (req, res) => {
  try {
    const user = req.profile;
    if (user) {
      const bookings = await Camp_Owner.findOne({
        _id: user._id,
      }).populate({
        path: "camp_booking",
        match: {
          status: "Confirmed and Pending For Payment",
        },
      });

      console.log(bookings);
      res.send(bookings);
    } else {
      throw new Error("No User Found");
    }
  } catch (error) {
    if (error.message == "No User Found") {
      res.status(404).send("No user found");
    } else {
      res.status(404).send(error);
    }
  }
};

exports.get_payament_success = async (req, res) => {
  try {
    const user = req.profile;
    if (user) {
      const bookings = await Camp_Owner.findOne({
        _id: user._id,
      }).populate({
        path: "camp_booking",
        match: {
          payment_status: "success",
        },
      });
      console.log(bookings);
      res.send(bookings);
    } else {
      throw new Error("No User Found");
    }
  } catch (error) {
    if (error.message == "No User Found") {
      res.status(404).send("No user found");
    } else {
      res.status(404).send(error);
    }
  }
};
