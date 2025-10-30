
const express = require('express');
const router = express.Router();

const { verifyUserToken } = require('../../middlewares/authMiddleware');
const { createTripPlan, getTripPlans, getTripById, updateTripById , deleteTripById} = require('../../controllers/tripController/passengerController');
const { prepareAndValidate } = require('../../Helper/validate');

router.post('/trip', verifyUserToken,prepareAndValidate, createTripPlan);
router.get('/all-trips', verifyUserToken, getTripPlans);
router.get("/:id", verifyUserToken, getTripById);
router.put("/update/:id", verifyUserToken, updateTripById);
router.delete("/delete/:id", verifyUserToken, deleteTripById);


module.exports = router;