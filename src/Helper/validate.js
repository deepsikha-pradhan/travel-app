const TripPlan = require("../models/TripPlan")

const prepareAndValidate = (req, res, next) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.user:", req.user);
    console.log("req.user:", req.user.id);

    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    req.body.created_by = req.user.id;

    if (req.body.start_datetime) {
      req.body.start_dateTime = new Date(req.body.start_datetime);
      delete req.body.start_datetime;
    }
    if (req.body.end_datetime) {
      req.body.end_dateTime = new Date(req.body.end_datetime);
      delete req.body.end_datetime;
    }

    const tempDoc = new TripPlan(req.body);
    const error = tempDoc.validateSync();
    if (error) {
      const errors = Object.values(error.errors).map(e => ({
        field: e.path,
        message: e.message
      }));
      return res.status(400).json({ success: false, errors });
    }

    next();
  } catch (err) {
    console.error("Validation error:", err);
    res.status(500).json({ error: "Validation failed" });
  }
};

module.exports = { prepareAndValidate };