const User = require('../models/user');

const createUser = async(req, res)=>{
    try{
       const { first_name, last_name, email, phone_number, user_type, basic_details, vehicle_id, password} = req.body;
       const user = new User({ first_name, last_name, email, phone_number, user_type, basic_details, vehicle_id, password });
       await user.save();
       res.status(201).json({message: "user hase been cerated", user})

    } catch (err) {
        res.status(500).json({error:err.message})
    }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, new Error('Email and password are required'), 400);
    }
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, new Error('User not found'), 404);
    }
    const Match = await user.comparePassword(password);
    if (!Match) {
      return errorResponse(res, new Error('Invalid credentials'), 401);
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, user_type: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: '6h' }
    );
res.status(200).json({ success: true, data: { token, user: { _id: user._id, email: user.email, user_type: user.user_type } } });
  } catch (err) {
    errorResponse(res, err);
  }
};

module.exports = {createUser, loginUser}
