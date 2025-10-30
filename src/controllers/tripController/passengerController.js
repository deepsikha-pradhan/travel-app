
const TripPlan = require('../../models/TripPlan');
const Vehicle = require('../../models/Vehicle');
const { prepareAndValidate } = require('../../Helper/validate');

const createTripPlan = async (req, res) => {
  try {
    const { destination, pickup_destination, start_dateTime, end_dateTime, required_persons, trip_type, vehicle_id } = req.body;
    const created_by = req.user?._id || req.user?.id;

    console.log(req.user.id, "userid");

    if (!created_by) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const vehicle = await Vehicle.findById(vehicle_id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    const tripPlan = new TripPlan({
      destination,
      pickup_destination,
      start_dateTime,   
      end_dateTime,     
      required_persons,
      trip_type,
      created_by,
      vehicle_id,
    });

    await tripPlan.save();

    res.status(201).json({
      success: true,
      message: "Trip plan created successfully",
      data: tripPlan,
    });
  } catch (err) {
    console.error("Error creating trip plan:", err);
    res.status(500).json({ success: false, message: "Failed to create trip", error: err.message });
  }
};


const getTripPlans = async(req, res)=>{
    try{
        const filter = {};
        if(req.query.created_by) filter.created_by= req.query.created_by;
        const trips = await TripPlan.find(filter)
        .populate("created_by", "first_name last_name email")
        .populate("vehicle_id", "vehicle_number vehicle_type capacity");
        res.status(200).json({success:true, data: trips})

    }catch(error){
        console.error("Error fetching trip plans:", error);
        res.status(500).json({success:false, message:"Failed to fetch trips", error:error.message});

    }
}

const getTripById = async (req, res) => {
  

  try {
    const trip = await TripPlan.findById(req.params.id)
      .populate("created_by", "first_name last_name email")
      .populate("vehicle_id", "type_of_car plate_no seat_capacity");

    console.log("Trip found:", trip);

    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    res.status(200).json({ success: true, data: trip });
  } catch (error) {
    console.error("Error fetching trip:", error);
    res.status(500).json({ success: false, message: "Failed to fetch trip", error: error.message });
  }
};

const updateTripById = async (req, res) => {
    try{
        const updatedTrip = await TripPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTrip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    res.status(200).json({ success: true, message: "Trip updated successfully", data: updatedTrip });

    }catch (error){
    console.error("Error updating trip:", error);
    res.status(500).json({ success: false, message: "Failed to update trip", error: error.message });


    }
}


const deleteTripById = async (req, res) => {
    try {
    const deletedTrip = await TripPlan.findByIdAndDelete(req.params.id);
    if (!deletedTrip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    res.status(200).json({ success: true, message: "Trip deleted successfully" });
  } catch (err) {
    console.error("Error deleting trip:", err);
    res.status(500).json({ success: false, message: "Failed to delete trip", error: err.message });
  }
}


module.exports = { createTripPlan,deleteTripById, getTripPlans,updateTripById, getTripById };