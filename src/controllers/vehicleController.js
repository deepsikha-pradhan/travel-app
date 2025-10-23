
const Vehicle = require('../models/Vehicle')
const { validatePayload, verifyUserToken } = require('../middlewares/authMiddleware')


const createVehicle = async (req, res) => {
    console.log("req.body:", req.body);
    try {
        const vehicleData = req.body;
        const vehicle = new Vehicle(vehicleData);
        await vehicle.save();
        res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: { vehicle }
        });
        // console.log(res)
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
        console.log(error)
    }

}

const getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id).populate("driver_id", "first_name last_name email");
        if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found" });
        res.status(200).json({ success: true, data: vehicle });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllVehicles = async(req,res)=>{
    try {
        const vehicles = await Vehicle.find().populate("driver_id", "first_name last_name email");
        res.status(200).json({
            success: true,
            data: vehicles
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const updateVehiclebyId = async(req,res)=> {
    try{
       const {id} = req.params;
       const updates = {...req.body}
       const vehicle = await Vehicle.findByIdAndUpdate(id, updates, { new: true });
    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    console.error("Update Vehicle Error:", error);
    res.status(500).json({ success: false, message: error.message });
  
    }
}

const deleteVehiclebyId = async(req,res)=>{
    try{
        const {id} = req.params;
        const result = await Vehicle.findByIdAndDelete(id);
        if (!result) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    res.status(200).json({ success: true, message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error("Delete Vehicle Error:", error);
    res.status(500).json({ success: false, message: error.message });
  
    }
}






module.exports = { createVehicle, getVehicleById, getAllVehicles, updateVehiclebyId,deleteVehiclebyId }