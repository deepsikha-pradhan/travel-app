const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

   
    const saltRounds = 10;
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

        const {
            first_name,
            last_name,
            email,
            phone_number,
            user_type,
            basic_details,
            vehicle_id,
            password
        } = req.body || {};

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.first_name = first_name || user.first_name;
        user.last_name = last_name || user.last_name;
        user.email = email || user.email;
        user.phone_number = phone_number || user.phone_number;
        user.user_type = user_type || user.user_type;
        user.basic_details = basic_details || user.basic_details;
        user.vehicle_id = vehicle_id || user.vehicle_id;

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const resetToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_RESET_SECRET,
            { expiresIn: '3h' }
        );
        
        res.status(200).json({ message: 'Reset token generated', token: resetToken });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports = {createUser, loginUser, editUser, forgotPassword};
