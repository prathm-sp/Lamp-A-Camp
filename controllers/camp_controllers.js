const Camp = require("./../models/camps");

exports.accept_a_camp = async (req, res) => {
  console.log(req.body.camp_name);
  try {
    if (!req.body.camp_name) {
      throw new Error("Enter Camp Name");
    }
    const accept_camp = await Camp.findOne({ camp_name: req.body.camp_name });
    if (accept_camp) {
      if (accept_camp.status_of_camp == "complete") {
        accept_camp.status_of_camp = "Accepted";
        accept_camp.state_of_camp = "Active";
        await accept_camp.save();
        res.send(accept_camp);
      }
    } else {
      throw new Error("no camp found");
    }
  } catch (error) {
    if (error.message == "no camp found") {
      res.status(404).send(error.message);
    } else if (error.message == "Enter Camp Name") {
      res.status(409).send("Enter Camp Name To Accept A Camp");
    } else {
      res.status(400).send(error.message);
    }
  }
};

exports.get_all_camps = async (req, res) => {
  console.log("rees");
  try {
    const camps = await Camp.find({
      status_of_camp: "Accepted",
      state_of_camp: "Active",
    });
    if (!camps) {
      throw new Error("No Camps Found");
    }
    res.send(camps);
  } catch (error) {
    if (error.message == "No Camps Found") {
      res.status(404).send(error.message);
    } else {
      res.status(400).send(error.message);
    }
  }
};

exports.reject_a_camp = async (req, res) => {
  console.log(req.body.camp_name);
  try {
    if (!req.body.camp_name) {
      throw new Error("Enter Camp Name");
    }
    const reject_camp = await Camp.find({ camp_name: req.body.camp_name });
    if (reject_camp.length >= 1) {
      if (reject_camp[0].status_of_camp == "complete") {
        reject_camp[0].status_of_camp = "Reject";
        await reject_camp[0].save();
        res.send(reject_camp[0]);
      }
    } else {
      throw new Error("no camp found");
    }
  } catch (error) {
    if (error.message == "no camp found") {
      res.status(404).send(error.message);
    } else if (error.message == "Enter Camp Name") {
      res.status(409).send("Enter Camp Name To Reject A Camp");
    } else {
      res.status(400).send(error.message);
    }
  }
};

exports.get_accepted_camps = async (req, res) => {
  try {
    const camps = await Camp.find({ status_of_camp: "Accepted" });
    if (camps.length >= 1) {
      res.send(camps);
    } else {
      throw new Error("no camp found");
    }
  } catch (error) {
    if (error.message == "no camp found") {
      res.status(404).send(error.message);
    } else {
      res.status(400).send(error.message);
    }
  }
};

exports.get_rejected_camps = async (req, res) => {
  try {
    const camps = await Camp.find({ status_of_camp: "Reject" });
    if (camps.length >= 1) {
      res.send(camps);
    } else {
      throw new Error("no camp found");
    }
  } catch (error) {
    if (error.message == "no camp found") {
      res.status(404).send(error.message);
    } else {
      res.status(400).send(error.message);
    }
  }
};

exports.get_pending_camps = async (req, res) => {
  try {
    const camps = await Camp.find({ status_of_camp: "complete" });
    if (camps.length >= 1) {
      res.send(camps);
    } else {
      throw new Error("no camp found");
    }
  } catch (error) {
    if (error.message == "no camp found") {
      res.status(404).send(error.message);
    } else {
      res.status(400).send(error.message);
    }
  }
};

exports.get_active_camps = async (req, res) => {
  try {
    const camps = await Camp.find({ state_of_camp: "Active" });
    console.log(camps);
    if (camps.length == 0) {
      throw new Error("No Active Camps Found");
    } else {
      res.status(200).send(camps);
    }
  } catch (error) {
    if (error.message == "No Active Camps Found") {
      res.status(404).send("No Active Camps Found");
    } else {
      res.status(400).send(error.message);
    }
  }
};

exports.get_recent_camps = async (req, res) => {
  try {
    const camps = await Camp.find({
      status_of_camp: "Accepted",
      state_of_camp: "Active",
    }).limit(6);
    if (camps.length >= 1) {
      res.send(camps);
    } else {
      throw "No Recent camps";
    }
  } catch (error) {
    if (error.message == "No Recent camps") {
      res.status(404).send("No Recent camps");
    } else {
      res.status(400).send(error.message);
    }
  }
};

exports.get_trending_camps = async (req, res) => {
  try {
    const camps = await Camp.find({
      status_of_camp: "Accepted",
      state_of_camp: "Active",
    })
      .sort({ createdAt: -1 })
      .limit(6);
    if (camps.length >= 1) {
      res.send(camps);
    } else {
      throw "No trending camps";
    }
  } catch (error) {
    if (error.message == "No trending camps") {
      res.status(404).send("No trending camps");
    } else {
      res.status(400).send(error.message);
    }
  }
};

exports.get_inactive_camps = async (req, res) => {
  try {
    const camps = await Camp.find({ state_of_camp: "Inactive" });
    if (camps.length >= 1) {
      res.send(camps);
    } else {
      throw new Error("no camp found");
    }
  } catch (error) {
    if (error.message == "no camp found") {
      res.status(404).send(error.message);
    } else {
      res.status(400).send(error.message);
    }
  }
};

exports.mark_inactive_a_camp = async (req, res) => {
  console.log(req.body.camp_name);
  try {
    if (!req.body.camp_name) {
      throw new Error("Enter Camp Name");
    }
    const accept_camp = await Camp.findOne({ camp_name: req.body.camp_name });
    if (accept_camp) {
      if (accept_camp.state_of_camp == "Active") {
        accept_camp.state_of_camp = "Inactive";
        await accept_camp.save();
        res.send(accept_camp);
      }
    } else {
      throw new Error("no camp found");
    }
  } catch (error) {
    if (error.message == "no camp found") {
      res.status(404).send(error.message);
    } else if (error.message == "Enter Camp Name") {
      res.status(409).send("Enter Camp Name To Accept A Camp");
    } else {
      res.status(400).send(error.message);
    }
  }
};
