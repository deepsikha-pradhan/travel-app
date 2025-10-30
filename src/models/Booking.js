const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({

    trip_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Trip id needed"],
       ref: 'TripPlan',
      
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User id needed"],

    },
    seats_booked:{
        type: Number,
        required: [true, "Number of seats booked is required"],
        min: [1, "At least one seat must be booked"],
    },
    booking_status:{
        type: String,
        enum: ["pending", "confirmed", "cancelled", "completed"],
        default: "pending"
    },
}, { timestamps: true });
  

module.exports = mongoose.model('booking', bookingSchema);