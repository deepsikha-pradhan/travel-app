const Booking = require('../../models/Booking');
const TripPlan = require("../../models/TripPlan")

const createBooking = async (req, res) => {
  try {
    const { trip_id, seats_booked } = req.body;
    const user_id = req.user.id;

  
    const trip = await TripPlan.findOne({ _id: trip_id});
    if (!trip) return res.status(404).json({ message: "Trip not found or not available" });

    
    const bookedSeats = await Booking.aggregate([
      { $match: { trip_id: trip._id, booking_status: { $in: ['pending', 'confirmed', 'cancelled', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$seats_booked' } } }
    ]);

    const totalBooked = bookedSeats[0]?.total || 0;
    if (totalBooked + seats_booked > trip.required_persons) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    const booking = await Booking.create({
      trip_id,
      user_id,
      seats_booked,
      booking_status
    });

    await booking.populate('trip_id', 'destination pickup_destination start_dateTime');
    await booking.populate('user_id', 'first_name email phone');

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBookings = async (req,res)=>{
    try{
        const bookings = await Booking.find({user_id: req.user.id})
        .populate("trip_id", "destination pickup_destination start_dateTime end_dateTime")
        .populate("user_id", "first_name last_name email phone_number");
        res.status(200).json({success:true, data: bookings})
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

const getBookingById = async (req,res)=>{
    try{
const booking = await Booking.findOne({
    _id:req.params.id, user_id: req.user.id
})
.populate('trip_id')
.populate('user_id');

if(!booking) return res.status(404).json({message:"Booking not found"});
res.status(200).json({success:true, data: booking});
    }catch(error){
        res.status(500).json({error: error.message});

    }
}

const cancelBooking = async (req,res)=>{
  try{
    const booking = await Booking.findOne({
      _id: req.params.id,
      user_id: req.user.id,
      booking_status: { $in: ['pending', 'confirmed', 'cancelled', 'completed'] }

    })
    if(!booking) return res.status(404).json({message:"Bookingd not found"});
    booking.booking_status="cancelled";
    await booking.save();
    res.status(200).json({success:true, data:booking})

  }catch(error){
    res.status(500).json({error: error.message});

  }
}



module.exports = { createBooking,cancelBooking,getBookingById, getBookings };