const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone_number: { type: String, required: true },
  user_type: { type: String, required: true },
   password: { type: String, required: true },
  basic_details: { type: mongoose.Schema.Types.Mixed }, 
  vehicle_id: { type: mongoose.Schema.Types.ObjectId }, 
 
}, 
{ timestamps: true });

module.exports = mongoose.model('User', userSchema);