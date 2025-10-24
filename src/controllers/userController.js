const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cache = require ('../utils/cache')
const sendEmail = require('../utils/mailer')


const createUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      user_type,
      basic_details,
      vehicle_id,
      password,
    } = req.body;

    
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

   
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    
    const user = new User({
      first_name,
      last_name,
      email,
      phone_number,
      user_type,
      basic_details,
      vehicle_id,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: 'User has been created', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const Match = await user.comparePassword(password);
    if (!Match) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
   console.log(user, "user")
    const token = jwt.sign(
      { id: user._id, email: user.email, user_type: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: '6h' }
    );
    res.status(200).json({ success: true, data: { token, user: { _id: user._id, email: user.email, user_type: user.user_type } } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const editUser = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id)

        const {
            // first_name,
            // last_name,
            email,
            phone_number,
            user_type,
            basic_details,
            vehicle_id,
            password
        } = req.body || {};
        console.log(req.body)

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // user.first_name = first_name || user.first_name;
        // user.last_name = last_name || user.last_name;
        user.email = email || user.email;
        user.phone_number = phone_number || user.phone_number;
        user.user_type = user_type || user.user_type;
        user.basic_details = basic_details || user.basic_details;
        user.vehicle_id = vehicle_id || user.vehicle_id;

        if (password) {
            user.password = await bcrypt.hash(password, 10);
            console.log(password, user.password)
        }

        await user.save();
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteUser = async (req, res) => {
  try{
    const {id} = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user){
      console.log(user);
      return res.status(404).json({error:"user not found"})
    }
    res.status(200).json({message:"user has been deleted", user})
  }catch (error){
    res.status(500).json({error:error.message})
  }
}




const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(404).json({ status: "failure", msg: "User not found" });
    }

   
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    
    await cache.set(user.email, { otp, generatedTime: Date.now() });

    
    await sendEmail(user.email, "Password Reset OTP", `<p>Your OTP is <b>${otp}</b></p>`);

    res.status(200).json({ status: "success", msg: "OTP sent to your email" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};


const validateOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const cachedData = await cache.get(normalizedEmail);
    if (!cachedData) {
      return res.status(400).json({ status: "failure", msg: "No OTP found or expired" });
    }

    const { otp: storedOtp, generatedTime } = cachedData;

    if (storedOtp != otp) {
      return res.status(400).json({ status: "failure", msg: "Invalid OTP" });
    }

   
    if (Date.now() - generatedTime > 10 * 60 * 1000) {
      await cache.del(normalizedEmail);
      return res.status(400).json({ status: "failure", msg: "OTP has expired" });
    }


    await cache.del(normalizedEmail);

    const user = await User.findOne({ email: normalizedEmail });
    res.status(200).json({
      status: "success",
      msg: "OTP validated successfully",
      user_id: user._id,
    });
  } catch (err) {
    console.error("OTP Validation Error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};


const updatePassword = async (req, res) => {
  console.log("Headers:", req.headers);
console.log("Body:", req.body);

  try {
    console.log("req.body:", req.body);

    const { user_id, newPassword } = req.body;
    console.log(user_id, "userid")
    if (!user_id || !newPassword) return res.status(400).json({ status: "failure", msg: "user_id and newPassword are required" });

    const user = await User.findById(user_id);
    if (!user) return res.status(404).json({ status: "failure", msg: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ status: "success", msg: "Password updated successfully" });
  } catch (err) {
    console.error("Update Password Error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};





module.exports = {createUser, loginUser, editUser,deleteUser, forgotPassword,updatePassword, validateOtp};
