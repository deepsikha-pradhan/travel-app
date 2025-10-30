const mongoose = require('mongoose');

const tripPlanSchema = new mongoose.Schema({
    destination: {
        type: String,
        required: [true, "Destination is required"],
        trim: true
    },
    pickup_destination: {
        type: String,
        required: [true, "Pickup destination is required"],
        trim: true
    },
    start_dateTime: {
        type: Date,
        required: [true, "Start date and time is required"],
        validate: {
            validator: function (value) {
                return value > new Date();
            },
            message: "Start date Time cannot be in the past"
        }
    },
    end_dateTime: {
        type: Date,
        required: [true, "End date and time is required"],
        validate: {
            validator: function (value) {
                return value > this.start_dateTime;
            },
            message: "End date Time must be after start date time"
        }
    },
    trip_type: {
        type: String,
        required: [true, "Trip type is required"],
        enum: {
            values: ['one-way', 'round-trip', 'multi-city','airport-transfer'],
            message: "{VALUE} is not a valid trip typee"
        },
        trim: true
    },
    required_persons: {
        type: Number,
        required: [true, "Required person is needed"],
        min: [1, "At least one person is required"],
        max: [50, "Cannot exceed 50 persons"]

    },

    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Creator id required"]
    },
    vehicle_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: [true, "Vehicle id missing"]
    },
    trip_map: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    }
},
    {
        timestamp: true
    });

module.exports = mongoose.model('TripPlan', tripPlanSchema);



