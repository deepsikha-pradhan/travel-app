const express = require ('express');
const router = express.Router();

const {verifyUserToken} = require("../../middlewares/authMiddleware")
const {createBooking, getBookings, getBookingById,cancelBooking} = require("../../controllers/bookingController/passengerBooking")


router.post('/bookings', verifyUserToken, createBooking);
router.get('/allbookings', verifyUserToken, getBookings);
router.get('/booking/:id', verifyUserToken, getBookingById);
router.put('/booking/:id/cancel', verifyUserToken, cancelBooking);


module.exports = router;