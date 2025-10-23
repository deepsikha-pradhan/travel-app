const mongoose = require ('mongoose')

const vehicleSchema = new mongoose.Schema({
    driver_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Driver id needed"]
    },
   type_of_car:{
    type: String,
    required:[true, "Type of car"],
    enum:["sedan", "suv","van","bus" ],
    trim:true,

    },
    vehicle_registration_day:{
        type:Date,
        required:true
    },
    travel_temp:{

    },
    seat_capacity:{
        type:Number,
        required:[true, "seat capacity needed"],
       min:[1, "seat capacity must be atlst 1"],
       max:[50,"seat capacity must be atlst 50"],

    },
    model_no:{
        type:String,
        required:[true, "model number is needed"],
        trim:true

    },
    plate_no:{
        type:String,
        required:[true, "plate number is needed"],
        unique:true,
        trim:true,
        uppercase:true

    },
    car_policy:{
        type:String,
        required:[true, "car policy is needed"],
        trim:true
    },

    car_book:{

    },
},
    {
        timestamps:true
    
})


module.exports=mongoose.model('Vehicle', vehicleSchema)