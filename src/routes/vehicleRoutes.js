const express = require('express')

const {createVehicle, getVehicleById, getAllVehicles, updateVehiclebyId, deleteVehiclebyId} = require("../controllers/vehicleController")
const {validatePayload, verifyUserToken} = require("../middlewares/authMiddleware")
const vehicleSchema = require("../models/Vehicle")

const router = express.Router();
router.post('/vehicle',verifyUserToken,validatePayload({rule:vehicleSchema}),createVehicle);
router.get('/vehicle/:id', verifyUserToken, getVehicleById)
router.get('/vehicles', verifyUserToken, getAllVehicles)
router.put('/vehicle/:id', verifyUserToken, updateVehiclebyId)
router.delete('/vehicle/:id', verifyUserToken, deleteVehiclebyId)

module.exports = router;